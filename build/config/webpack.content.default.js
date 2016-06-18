// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import path from 'path';
import webpack from 'webpack';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import defaultConfig from './webpack.base';
import * as Const from '../utils/const';

export const SHARED_DIR = path.join(Const.SRC_DIR, 'ui', 'shared');
export const SRC_DIR = path.join(Const.SRC_DIR, 'ui', 'content');
export const DST_DIR = path.join(Const.LIB_DIR, 'ui', 'content');

export default {
  ...defaultConfig,
  entry: path.join(SRC_DIR, 'index.jsx'),
  output: {
    ...defaultConfig.output,
    path: DST_DIR,
    filename: 'index.js',
    sourceMapFilename: 'index.map',
  },
  plugins: [
    ...defaultConfig.plugins,
    new webpack.DefinePlugin({
      PROCESS_TYPE: '"content"',
    }),
    new CopyWebpackPlugin([{
      from: path.join(SRC_DIR, '*.html'),
      to: DST_DIR,
      flatten: true,
    }]),
    new CopyWebpackPlugin([{
      from: path.join(SRC_DIR, 'css', '*.css'),
      to: path.join(DST_DIR, 'css'),
      flatten: true,
    }]),
    new CopyWebpackPlugin([{
      from: path.join(SHARED_DIR, 'css', '*.css'),
      to: path.join(DST_DIR, 'css'),
      flatten: true,
    }]),
    new CopyWebpackPlugin([{
      from: path.join(SHARED_DIR, 'assets'),
      to: path.join(DST_DIR, 'assets'),
      flatten: true,
    }]),
  ],
  target: 'web',
};
