'use strict';

const webpack = require('webpack');

const webpackProdConfig = require('./webpack.config.prod');
const webpackDevConfig = require('./webpack.config.dev');

module.exports = callback => {
  let config = require('../build-config').development ? webpackDevConfig : webpackProdConfig;
  try {
    let compiler = webpack(config);
    compiler.run(callback);
  } catch (e) {
    callback(e);
  }
};
