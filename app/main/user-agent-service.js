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
import * as Task from 'co-task';

import { ProfileStorage, StarOp } from '../services/storage';
import * as profileDiffs from '../shared/profile-diffs';

const PORT = 9090;

function configure(app: any, storage: ProfileStorage) {
  app.use(morgan('combined'));

  // These need to be register before our routes.
  app.use(bodyParser.json());
  app.use(expressValidator()); // Keep this immediately after express.bodyParser().

  /**
   * Catch errors from the given generator function and forward them to `next` for handling.
   *
   * @param genfun: function*(req, res, next)
   * @returns {function(req, res, next): (Promise.<T>)}
   */
  function wrap(genfun) {
    return (...args) => Task.async(genfun)(...args).catch(args[2]); // next = args[2];
  }

  const initial = Task.async(function*() {
    const stars = yield storage.starredURLs();
    const recentStars = yield storage.recentlyStarred();
    return { stars, recentStars };
  });

  const diffsClients = [];
  app.ws('/diffs', Task.async(function* (ws, _req) {
    diffsClients.push(ws);

    ws.send(JSON.stringify({ type: 'initial', payload: yield initial() }));

    ws.on('close', () => {
      const index = diffsClients.indexOf(ws);
      if (index > -1) {
        diffsClients.splice(index, 1);
      }
    });
  }));

  function sendDiff(diff) {
    diffsClients.forEach((ws) => {
      ws.send(JSON.stringify(diff));
    });
  }

  function dispatchBookmarkDiffs() {
    setImmediate(() => Task.spawn(function* () {
      // TODO: only send add/remove starredness for `url`, rather than grabbing the whole set.
      sendDiff(profileDiffs.bookmarks(yield storage.starredURLs()));

      sendDiff({ type: '/stars/recent', payload: yield storage.recentlyStarred() });
    }));
  }

  app.post('/session/start', wrap(function* (req, res) {
    req.checkBody('scope').notEmpty().isInt();
    req.checkBody('ancestor').optional().isInt();

    const errors = req.validationErrors();
    if (errors) {
      console.warn(errors);
      res.status(401).json(errors);
      return;
    }

    const { scope, ancestor } = req.body;
    const session = yield storage.startSession(scope, ancestor);
    res.json({ session });
  }));

  app.post('/session/end', wrap(function* (req, res) {
    req.checkBody('session').isInt().notEmpty();

    const errors = req.validationErrors();
    if (errors) {
      res.status(401).json(errors);
      return;
    }

    const { session } = req.body;
    yield storage.endSession(session);
    res.json();
  }));

  app.post('/visits', wrap(function* (req, res) {
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
    yield storage.visit(url, session, title);
    res.json();
  }));

  app.get('/visits', wrap(function* (req, res) {
    req.checkQuery('q').notEmpty();

    const errors = req.validationErrors();
    if (errors) {
      res.status(401).json(errors);
      return;
    }

    const { q } = req.query;
    const results = yield storage.query(q);
    res.json({ results });
  }));

  app.put('/stars/:url', wrap(function* (req, res) {
    req.checkParams('url').notEmpty();
    req.checkBody('title').optional();
    req.checkBody('session').isInt().notEmpty();

    const errors = req.validationErrors();
    if (errors) {
      res.status(401).json(errors);
      return;
    }

    const { session, _title } = req.body;
    yield storage.starPage(req.params.url, session, StarOp.star);
    res.json();

    dispatchBookmarkDiffs();
  }));

  app.delete('/stars/:url', wrap(function* (req, res) {
    req.checkParams('url').notEmpty();
    req.checkBody('session').isInt().notEmpty();

    const errors = req.validationErrors();
    if (errors) {
      res.status(401).json(errors);
      return;
    }

    const { session, _title } = req.body;
    yield storage.starPage(req.params.url, session, StarOp.unstar);
    res.json();

    dispatchBookmarkDiffs();
  }));

  app.get('/stars', wrap(function* (req, res) {
    const errors = req.validationErrors();
    if (errors) {
      res.status(401).json(errors);
      return;
    }

    const stars = yield storage.starredURLs();
    res.json({ stars });
  }));

  app.get('/recentStars', wrap(function* (req, res) {
    const errors = req.validationErrors();
    if (errors) {
      res.status(401).json(errors);
      return;
    }

    const stars = yield storage.recentlyStarred();
    console.log(JSON.stringify(stars));

    res.json({ stars });
  }));

  app.post('/pages/:url', wrap(function* (req, res) {
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
    yield storage.savePage(page, session);
    res.json();
  }));

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
export function start(storage: ProfileStorage, port: ?number = PORT, debug: ?boolean = false) {
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

  return new Promise((resolve, reject) => {
    const app = express();
    expressWs(app);

    configure(app, storage);

    if (debug) {
      storage.db.db.on('trace', console.log);
    }

    server = app.listen(port, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve({ port, stop });
      }
    });
  });
}
