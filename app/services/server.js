/* eslint no-console: 0 */

// Putting a web server in the node process probably isn't the best idea from
// a live perf POV, but from a dev perf POV, it enables HMR which kills.

const path = require('path');
const http = require('http');
const express = require('express');
const morgan = require('morgan');

const { isProduction } = require('../../shared/util');

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
    // modules on request.
    try {
      const webpack = require('webpack');
      const devMiddleware = require('webpack-dev-middleware');
      const hotMiddleware = require('webpack-hot-middleware');
      const webpackConfig = require('../../build/webpack.config.dev');

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
