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

import express from 'express';
import expressWs from 'express-ws';
import expressValidator from 'express-validator';
import bodyParser from 'body-parser';
import morgan from 'morgan';

/**
 * Catch errors from the given async `method` and forward them to `next` for handling.
 * This allows writing "loose" handling code and still opt-in to express's error
 * handling backstop. Optionally, a validator function can be given to make use
 * of the `express-validator` middleware and validate requests before routing.
 */
export function autoCaughtRouteError({ validator, method }) {
  return async function(req, res, next) {
    try {
      if (validator) {
        validator(req);
      }

      const errors = req.validationErrors();
      if (errors) {
        console.warn(errors);
        res.status(401).json(errors);
        return;
      }

      await method(req, res, next);
    } catch (e) {
      next(e);
    }
  };
}

/**
 * Exposes functionality that starts up an express static server on the given
 * address and port, routing requests through the `version` path.
 * Returns the `setup` and `stop` functions to start and stop the server.
 * A configuration function can be passed to `setup`, called with the
 * `app` and `routes` objects, to configure additional server behavior.
 */
export function makeServer(version, addr, port) {
  let server;
  let wsserver;
  let app;
  let router;

  function setup(config) {
    return new Promise(async function(resolve, reject) {
      if (server) {
        reject(new Error('The server was already started.'));
      }

      app = express();
      router = express.Router();
      const { getWss } = expressWs(app);

      app.use(morgan('combined'));

      // These need to be registered before our routes.
      app.use(bodyParser.json());
      app.use(expressValidator());

      await config(app, router);

      // Version namespace!
      app.use(`/${version}`, router);

      // Must follow route definitions! Need to have four arguments here
      // so express knows that we want to handle errors.
      app.use((error, req, res, _next) => {
        console.error(error.stack);
        res.status(500).json({ error, stack: error.stack });
      });

      // Sadly, app.listen does not return the HTTP server just yet.
      // Therefore, we extract it manually below.
      app.listen(port, addr, resolve);
      wsserver = getWss();
      server = wsserver._server;

      server.on('error', reject);
      wsserver.on('error', reject);
    });
  }

  function stop() {
    return new Promise((resolve, reject) => {
      if (!server) {
        reject(new Error('The server was not started yet.'));
      }
      server.close(err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  return { setup, stop };
}
