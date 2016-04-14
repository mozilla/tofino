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

// Putting a web server in the node process probably isn't the best idea from
// a live perf POV, but from a dev perf POV, it enables HMR which kills.

import path from 'path';
import http from 'http';
import express from 'express';
import morgan from 'morgan';

import { isProduction } from '../../shared/util';

const port = 8765;
const host = undefined; // 'localhost';

export function serve(staticDir) {
  const app = express();

  const morganOptions = {};
  const morganLevel = isProduction() ? 'combined' : 'dev';
  app.use(morgan(morganLevel, morganOptions));

  // Serve the static website resources
  const cssDir = path.join(staticDir, 'css');
  app.use('/css/', express.static(cssDir));

  const fontsDir = path.join(staticDir, 'fonts');
  app.use('/fonts/', express.static(fontsDir));

  const assetsDir = path.join(staticDir, 'assets');
  app.use('/assets/', express.static(assetsDir));

  const index = path.join(staticDir, 'browser.html');
  function showIndex(req, res) {
    res.sendFile(index);
  }

  app.get('/', showIndex);
  app.get('/browser.html', showIndex);

  // Serve the built resources, i.e. JavaScript
  if (isProduction()) {
    const builtDir = path.join(staticDir, 'built');
    app.use('/built/', express.static(builtDir));
  } else {
    // These are only used in development environment where we rebuild
    // modules on request. Need to use `require` here since native module
    // imports don't have lazy loading and need to be at the top level.
    try {
      const webpack = require('webpack');
      const devMiddleware = require('webpack-dev-middleware');
      const hotMiddleware = require('webpack-hot-middleware');
      const webpackConfig = require('../../build/webpack.config.dev').default;

      const compiler = webpack(webpackConfig);

      app.use(devMiddleware(compiler, {
        noInfo: true,
        publicPath: webpackConfig.output.publicPath,
      }));

      app.use(hotMiddleware(compiler));
    } catch (e) {
      console.error('Could not create webpack middleware.');
    }
  }

  const server = http.createServer(app);
  server.listen(port, host, err => {
    if (err) {
      console.log(err);
    }

    console.log(`Listening at ${host}:${port}`);
  });
}
