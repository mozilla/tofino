// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

'use strict';

const webpack = require('webpack');

const webpackProdConfig = require('./webpack.config.prod');
const webpackDevConfig = require('./webpack.config.dev');
const { development } = require('../build-config');

module.exports = () => new Promise((resolve, reject) => {
  const config = development ? webpackDevConfig : webpackProdConfig;
  try {
    const compiler = webpack(config);
    compiler.run(resolve);
  } catch (err) {
    reject(err);
  }
});
