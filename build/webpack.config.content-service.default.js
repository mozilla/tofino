// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import webpack from 'webpack';
import path from 'path';
import nodeExternals from 'webpack-node-externals';
import defaultConfig from './webpack.config.base';
import * as Const from './const';

const src = path.join(Const.SRC_DIR, 'services', 'content-service');
const dest = path.join(Const.BUILD_DIR, 'services', 'content-service');

export default {
  ...defaultConfig,
  entry: path.join(src, 'index.js'),
  output: {
    path: dest,
    filename: 'index.js',
    sourceMapFilename: 'index.map',
  },
  target: 'node',
  plugins: [
    ...defaultConfig.plugins,
    new webpack.DefinePlugin({
      LIBDIR: 'require("path").join(__dirname, "..", "..")',
    }),
  ],
  externals: [nodeExternals()],
};
