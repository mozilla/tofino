// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

'use strict';

const webpack = require('webpack');

const webpackProdConfig = require('./webpack.config.prod');
const webpackDevConfig = require('./webpack.config.dev');

module.exports = callback => {
  const config = require('../build-config').development ? webpackDevConfig : webpackProdConfig;
  try {
    const compiler = webpack(config);
    compiler.run(callback);
  } catch (e) {
    callback(e);
  }
};
