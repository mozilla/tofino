// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import webpack from 'webpack';
import path from 'path';
import nodeExternals from 'webpack-node-externals';
import defaultConfig from './webpack.config.base';
import * as Const from './const';

export const SRC_DIR = path.join(Const.SRC_DIR, 'services', 'content-service');
export const DST_DIR = path.join(Const.BUILD_DIR, 'services', 'content-service');

export default {
  ...defaultConfig,
  entry: path.join(SRC_DIR, 'index.js'),
  output: {
    ...defaultConfig.output,
    path: DST_DIR,
    filename: 'index.js',
    sourceMapFilename: 'index.map',
  },
  target: 'node',
  plugins: [
    ...defaultConfig.plugins,
    new webpack.DefinePlugin({
      PROCESS_TYPE: '"content-service"',
    }),
    new webpack.DefinePlugin({
      LIBDIR: 'require("path").join(__dirname, "..", "..")',
    }),
  ],
  externals: [
    ...defaultConfig.externals,
    nodeExternals(),
  ],
};
