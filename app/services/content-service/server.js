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
/* global LIBDIR */

import path from 'path';
import express from 'express';
import { logger } from '../../shared/logging';
import { makeServer, autoCaughtRouteError } from './util';
import * as endpoints from '../../shared/constants/endpoints';

const UI_DIR = path.join(LIBDIR, 'ui');

const VALID_PAGES = [
  'history',
  'stars',
];

function configure(app, router) {
  const content = path.join(UI_DIR, 'content');
  router.use(express.static(content));
  logger.info(`Serving static content from ${content}`);

  for (const page of VALID_PAGES) {
    const route = `${endpoints.CONTENT_SERVER_VERSION}/${page}`;
    app.use(`/${route}`, router);
  }

  router.get('/credits', autoCaughtRouteError({
    async method(req, res) {
      res.sendFile(path.join(UI_DIR, 'content', 'credits.html'));
    },
  }));

  router.get('/:page', autoCaughtRouteError({
    validator(req) {
      req.checkParams('page').matches(new RegExp(`^${VALID_PAGES.join('|')}$`, 'i'));
    },
    async method(req, res) {
      res.sendFile(path.join(UI_DIR, 'content', 'index.html'));
    },
  }));
}

export async function start() {
  const { setup } = await makeServer(
    endpoints.CONTENT_SERVER_VERSION,
    endpoints.CONTENT_SERVER_PORT);

  await setup(configure);

  // This process gets a SIGKILL from the parent when the
  // server needs to shut down.
}
