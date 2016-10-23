// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import path from 'path';
import webpack from 'webpack';
import defaultConfig from './webpack.base';
import { uiFiles, sharedFiles } from './webpack.base.snippets.ui-shared';
import * as Const from '../utils/const';

export const SHARED_DIR = path.join(Const.SRC_DIR, 'ui', 'shared');
export const SRC_DIR = path.join(Const.SRC_DIR, 'ui', 'browser-alt');
export const DST_DIR = path.join(Const.LIB_DIR, 'ui', 'browser-alt');

export default {
  ...defaultConfig,
  entry: path.join(SRC_DIR, 'index.js'),
  output: {
    ...defaultConfig.output,
    path: DST_DIR,
    filename: 'index.js',
    sourceMapFilename: 'index.map',
  },
  plugins: [
    ...defaultConfig.plugins,
    ...uiFiles(SRC_DIR, DST_DIR),
    ...sharedFiles(SHARED_DIR, DST_DIR),
    new webpack.DefinePlugin({
      PROCESS_TYPE: '"ui"',
    }),
  ],
  target: 'electron-renderer',
};
