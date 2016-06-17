// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import path from 'path';
import webpack from 'webpack';
import defaultConfig from './webpack.config.base';
import * as Const from './utils/const';

export const SRC_DIR = path.join(Const.SRC_DIR, 'ui', 'preload');
export const DST_DIR = path.join(Const.LIB_DIR, 'ui', 'preload');

export default {
  ...defaultConfig,
  entry: path.join(SRC_DIR, 'index.js'),
  output: {
    path: DST_DIR,
    filename: 'index.js',
    sourceMapFilename: 'index.map',
  },
  plugins: [
    ...defaultConfig.plugins,
    new webpack.DefinePlugin({
      PROCESS_TYPE: '"preload"',
    }),
  ],
  target: 'electron-renderer',
};
