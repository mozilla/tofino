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

import { logger } from '../../shared/logging';
import { makeServer, autoCaughtRouteError } from '../common';
import { SnippetSize, StarOp } from './storage';
import * as profileDiffs from '../../shared/profile-diffs';

const allowCrossDomain = contentServiceOrigin => function(req, res, next) {
  const origin = req.get('origin');
  if (!origin) {
    next();
    return;
  }

  // For some reason, setting the `Access-Control-Allow-Origin` header to
  // the `contentServiceOrigin` value doesn't work for our custom `tofino://`
  // http scheme, when receiving requests from electron. For example, when
  // allowing origin `tofino://` and the request is from `tofino://history`,
  // CORS won't work even though it should. As a workaround, whitelist directly.
  if (origin.startsWith(contentServiceOrigin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
  }

  next();
};

function configure(app, router, storage, contentServiceOrigin) {
  app.use(allowCrossDomain(contentServiceOrigin));

  async function initial() {
    const stars = await storage.starredURLs();
    const recentStars = await storage.recentlyStarred();
    return { stars, recentStars };
  }

  const wsClients = [];

  router.ws('/ws', async function(ws, _req) {
    wsClients.push(ws);

    ws.send(JSON.stringify({
      message: 'protocol',
      version: 'v1',
      clientCount: wsClients.length,
    }));

    ws.send(JSON.stringify({
      message: 'diff',
      type: 'initial',
      payload: await initial(),
    }));

    ws.on('close', () => {
      const index = wsClients.indexOf(ws);
      if (index > -1) {
        wsClients.splice(index, 1);
      }
    });
  });

  function sendDiff(diff) {
    wsClients.forEach((ws) => {
      ws.send(JSON.stringify({
        message: 'diff',
        ...diff,
      }));
    });
  }

  async function dispatchBookmarkDiffs() {
    // TODO: only send add/remove starredness for `url`, rather than grabbing the whole set.
    const stars = await storage.starredURLs();
    sendDiff(profileDiffs.bookmarks(stars));
    sendDiff({ type: '/stars/recent', payload: await storage.recentlyStarred() });
  }

  router.post('/session/start', autoCaughtRouteError({
    validator(req) {
      req.checkBody('scope').optional().isInt();
      req.checkBody('ancestor').optional().isInt();
    },
    async method(req, res) {
      const { scope, ancestor } = req.body;
      const session = await storage.startSession(scope, ancestor);
      res.json({ session });
    },
  }));

  router.post('/session/end', autoCaughtRouteError({
    validator(req) {
      req.checkBody('session').isInt().notEmpty();
    },
    async method(req, res) {
      const { session } = req.body;
      await storage.endSession(session);
      res.json({});
    },
  }));

  router.post('/visits', autoCaughtRouteError({
    validator(req) {
      req.checkBody('url').notEmpty();
      req.checkBody('title').optional();
      req.checkBody('session').notEmpty().isInt();
    },
    async method(req, res) {
      // TODO: include visit types.
      const { url, session, title } = req.body;
      await storage.visit(url, session, title);
      res.json({});
    },
  }));

  router.get('/visits', autoCaughtRouteError({
    validator(req) {
      req.checkQuery('limit').isInt().notEmpty();
    },
    async method(req, res) {
      // TODO: this should return full-fledged page objects.
      const limit = parseInt(req.query.limit, 10) || Number.MAX_SAFE_INTEGER;
      const pages = await storage.visited(0, limit);
      res.json({ pages });
    },
  }));

  router.get('/query', autoCaughtRouteError({
    validator(req) {
      req.checkQuery('q').notEmpty();
      req.checkQuery('limit').optional().isInt();
      req.checkQuery('since').optional().isInt();
      req.checkQuery('snippetSize').optional();
    },
    async method(req, res) {
      const snippetSize = SnippetSize[req.query.snippetSize] || SnippetSize.medium;
      const { q } = req.query;
      const results = await storage.query(q, req.query.since, req.query.limit, snippetSize);
      res.json({ results });
    },
  }));

  router.put('/stars/:url', autoCaughtRouteError({
    validator(req) {
      req.checkParams('url').notEmpty();
      req.checkBody('title').optional();
      req.checkBody('session').isInt().notEmpty();
    },
    async method(req, res) {
      const { session, _title } = req.body;
      await storage.starPage(req.params.url, session, StarOp.star);
      res.json({});

      dispatchBookmarkDiffs(); // Spawn, but don't await.
    },
  }));

  router.delete('/stars/:url', autoCaughtRouteError({
    validator(req) {
      req.checkParams('url').notEmpty();
      req.checkBody('session').isInt().notEmpty();
    },
    async method(req, res) {
      const { session, _title } = req.body;
      await storage.starPage(req.params.url, session, StarOp.unstar);
      res.json({});

      dispatchBookmarkDiffs(); // Spawn, but don't await.
    },
  }));

  router.get('/stars', autoCaughtRouteError({
    async method(req, res) {
      const stars = await storage.starredURLs();
      res.json({ stars });
    },
  }));

  router.get('/recentStars', autoCaughtRouteError({
    validator(req) {
      req.checkQuery('limit').isInt().notEmpty();
    },
    async method(req, res) {
      const limit = parseInt(req.query.limit, 10) || Number.MAX_SAFE_INTEGER;
      const stars = await storage.recentlyStarred(limit);
      res.json({ stars });
    },
  }));

  router.post('/pages/:url', autoCaughtRouteError({
    validator(req) {
      req.checkParams('url').notEmpty();
      req.checkBody(['page', 'textContent']).notEmpty();
      req.checkBody('session').isInt().notEmpty();
    },
    async method(req, res) {
      const { page, session } = req.body;
      page.uri = req.params.url;
      await storage.savePage(page, session);
      res.json({});
    },
  }));
}

export async function start({ storage, options }) {
  const version = options.version;
  const port = options.port;
  const contentServiceOrigin = options.contentServiceOrigin;

  const { setup } = makeServer(version, port);

  await setup((app, router) => {
    logger.info(`Enabling CORS for the Content service on ${options.contentServiceOrigin}`);
    configure(app, router, storage, contentServiceOrigin);

    if (options.debug) {
      storage.db.db.on('trace', logger.trace);
    }
  });
}
