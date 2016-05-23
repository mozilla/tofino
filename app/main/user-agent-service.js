/* @flow */

/*
 Copyright 2016 Mozilla

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use
 this file except in compliance with the License. You may obtain a copy of the
 License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed
 under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 CONDITIONS OF ANY KIND, either express or implied. See the License for the
 specific language governing permissions and limitations under the License.
 */

/* eslint no-console: 0 */

import express from 'express';
import expressWs from 'express-ws';
import expressValidator from 'express-validator';
import bodyParser from 'body-parser';
import morgan from 'morgan';

import { ProfileStorage, SnippetSize, StarOp } from '../services/storage';
import * as profileDiffs from '../shared/profile-diffs';

const allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'tofino://');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  next();
};

function configure(app: any, storage: ProfileStorage) {
  app.use(morgan('combined'));

  // These need to be register before our routes.
  app.use(bodyParser.json());
  app.use(expressValidator()); // Keep this immediately after express.bodyParser().

  app.use(allowCrossDomain);

  const router = express.Router(); // eslint-disable-line new-cap

  /**
   * Catch errors from the given async function and forward them to `next` for handling.  This
   * allows to write "loose" handling code and still opt-in to Express's error handling backstop.
   *
   * @param fun: async function(req, res, next)
   * @returns {function(req, res, next): (Promise.<T>)}
   */
  function wrap(fun) {
    return async function(...args) {
      try {
        await fun(...args);
      } catch (e) {
        const next = args[2];
        next(e);
      }
    };
  }

  async function initial() {
    const stars = await storage.starredURLs();
    const recentStars = await storage.recentlyStarred();
    return { stars, recentStars };
  }

  const diffsClients = [];
  router.ws('/diffs', async function(ws, _req) {
    diffsClients.push(ws);

    ws.send(JSON.stringify({ type: 'initial', payload: await initial() }));

    ws.on('close', () => {
      const index = diffsClients.indexOf(ws);
      if (index > -1) {
        diffsClients.splice(index, 1);
      }
    });
  });

  function sendDiff(diff) {
    diffsClients.forEach((ws) => {
      ws.send(JSON.stringify(diff));
    });
  }

  async function dispatchBookmarkDiffs() {
    // TODO: only send add/remove starredness for `url`, rather than grabbing the whole set.
    const stars = await storage.starredURLs();
    sendDiff(profileDiffs.bookmarks(stars));

    sendDiff({ type: '/stars/recent', payload: await storage.recentlyStarred() });
  }

  router.post('/session/start', wrap(async function(req, res) {
    req.checkBody('scope').notEmpty().isInt();
    req.checkBody('ancestor').optional().isInt();

    const errors = req.validationErrors();
    if (errors) {
      console.warn(errors);
      res.status(401).json(errors);
      return;
    }

    const { scope, ancestor } = req.body;
    const session = await storage.startSession(scope, ancestor);
    res.json({ session });
  }));

  router.post('/session/end', wrap(async function(req, res) {
    req.checkBody('session').isInt().notEmpty();

    const errors = req.validationErrors();
    if (errors) {
      res.status(401).json(errors);
      return;
    }

    const { session } = req.body;
    await storage.endSession(session);
    res.json({});
  }));

  router.post('/visits', wrap(async function(req, res) {
    req.checkBody('url').notEmpty();
    req.checkBody('title').optional();
    req.checkBody('session').notEmpty().isInt();

    const errors = req.validationErrors();
    if (errors) {
      res.status(401).json(errors);
      return;
    }

    // TODO: include visit types.
    const { url, session, title } = req.body;
    await storage.visit(url, session, title);
    res.json({});
  }));

  router.get('/visits', wrap(async function(req, res) {
    req.checkQuery('limit').isInt().notEmpty();
    const errors = req.validationErrors();
    if (errors) {
      res.status(401).json(errors);
      return;
    }

    const limit = parseInt(req.query.limit, 10) || Number.MAX_SAFE_INTEGER;

    // TODO: this should return full-fledged page objects.
    const pages = await storage.visited(0, limit);
    res.json({ pages });
  }));

  router.get('/query', wrap(async function(req, res) {
    req.checkQuery('q').notEmpty();
    req.checkQuery('limit').optional().isInt();
    req.checkQuery('since').optional().isInt();
    req.checkQuery('snippetSize').optional();

    const errors = req.validationErrors();
    if (errors) {
      res.status(401).json(errors);
      return;
    }

    const snippetSize = SnippetSize[req.query.snippetSize] || SnippetSize.medium;
    const { q } = req.query;
    const results = await storage.query(q, req.query.since, req.query.limit, snippetSize);
    res.json({ results });
  }));

  router.put('/stars/:url', wrap(async function(req, res) {
    req.checkParams('url').notEmpty();
    req.checkBody('title').optional();
    req.checkBody('session').isInt().notEmpty();

    const errors = req.validationErrors();
    if (errors) {
      res.status(401).json(errors);
      return;
    }

    const { session, _title } = req.body;
    await storage.starPage(req.params.url, session, StarOp.star);
    res.json({});

    dispatchBookmarkDiffs(); // Spawn, but don't await.
  }));

  router.delete('/stars/:url', wrap(async function(req, res) {
    req.checkParams('url').notEmpty();
    req.checkBody('session').isInt().notEmpty();

    const errors = req.validationErrors();
    if (errors) {
      res.status(401).json(errors);
      return;
    }

    const { session, _title } = req.body;
    await storage.starPage(req.params.url, session, StarOp.unstar);
    res.json({});

    dispatchBookmarkDiffs(); // Spawn, but don't await.
  }));

  router.get('/stars', wrap(async function(req, res) {
    const errors = req.validationErrors();
    if (errors) {
      res.status(401).json(errors);
      return;
    }

    const stars = await storage.starredURLs();
    res.json({ stars });
  }));

  router.get('/recentStars', wrap(async function(req, res) {
    req.checkQuery('limit').isInt().notEmpty();
    const errors = req.validationErrors();
    if (errors) {
      res.status(401).json(errors);
      return;
    }

    const limit = parseInt(req.query.limit, 10) || Number.MAX_SAFE_INTEGER;
    const stars = await storage.recentlyStarred(limit);
    res.json({ stars });
  }));

  router.post('/pages/:url', wrap(async function(req, res) {
    req.checkParams('url').notEmpty();
    req.checkBody(['page', 'textContent']).notEmpty();
    req.checkBody('session').isInt().notEmpty();

    const errors = req.validationErrors();
    if (errors) {
      res.status(401).json(errors);
      return;
    }

    const { page, session } = req.body;
    page.uri = req.params.url;
    await storage.savePage(page, session);
    res.json({});
  }));

  // Version namespace!
  app.use('/v1', router);

  // Must follow route definitions!
  app.use((error, req, res, _next) => {
    console.error(error.stack);
    res.status(500).json({ error, stack: error.stack });
  });
}

/**
 * Exposes a function that starts up an Express static server
 * to the `./fixtures` directory on port 8080.
 * Returns a promise that resolves to an object containing
 * both `port` and `stop` function to stop the server.
 *
 * @return {Promise<{ port, stop }>}
 */
export function start(storage: ProfileStorage,
                      port: number,
                      options: ?Object = {}) {
  const { debug, allowReuse } = options;

  let server;
  function stop() {
    return new Promise((res, rej) => {
      server.close(err => {
        if (err) {
          rej(err);
        } else {
          res();
        }
      });
    });
  }

  return new Promise((resolve) => {
    const app = express();
    const { getWss } = expressWs(app);

    configure(app, storage);

    if (debug) {
      storage.db.db.on('trace', console.log);
    }

    // Sadly, app.listen does not return the HTTP server just yet.
    // Therefore, we extract it manually below.
    app.listen(port, '127.0.0.1', () => {
      resolve({ app, getWss, stop, reused: false });
    });
    server = getWss()._server;

    if (allowReuse) {
      // Let's assume we're already running our service.
      server.on('error', (e) => {
        if (e.code !== 'EADDRINUSE') {
          throw e;
        }
      });

      getWss().on('error', (e) => {
        if (e.code !== 'EADDRINUSE') {
          throw e;
        }
        resolve({ app, getWss, reused: true });
      });
    }
  });
}
