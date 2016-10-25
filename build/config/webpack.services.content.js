// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import webpack from 'webpack';
import path from 'path';
import defaultConfig from './webpack.base';
import * as Const from '../utils/const';
import { nodeExternals } from '../utils/webpack';

export const SRC_DIR = path.join(Const.SRC_DIR, 'services', 'content-service');
export const DST_DIR = path.join(Const.LIB_DIR, 'services', 'content-service');

export default {
  ...defaultConfig,
  entry: path.join(SRC_DIR, 'index.js'),
  output: {
    ...defaultConfig.output,
    path: DST_DIR,
    filename: 'index.js',
    sourceMapFilename: 'index.map',
    libraryTarget: 'commonjs',
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
  resolve: {
    ...defaultConfig.resolve,
    alias: {
      ...defaultConfig.resolve.alias,
      'app/shared/environment': path.join(Const.SRC_DIR, 'shared', 'environment.js'),
    },
  },
  externals: [
    ...defaultConfig.externals,
    nodeExternals,
  ],
};
