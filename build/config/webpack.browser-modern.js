// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import path from 'path';
import webpack from 'webpack';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import defaultConfig from './webpack.base';
import * as Const from '../utils/const';

export const SHARED_DIR = path.join(Const.SRC_DIR, 'ui', 'shared');
export const SRC_DIR = path.join(Const.SRC_DIR, 'ui', 'browser-modern');
export const DST_DIR = path.join(Const.LIB_DIR, 'ui', 'browser-modern');

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
    new webpack.DefinePlugin({
      PROCESS_TYPE: '"ui"',
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
    new CopyWebpackPlugin([{
      from: path.join(SHARED_DIR, 'fonts'),
      to: path.join(DST_DIR, 'fonts'),
      flatten: true,
    }]),
  ],
  target: 'web',
  bail: true,

  resolve: {
    alias: {
      request: 'browser-request',
    },
    extensions: ['', '.js', '.jsx', '.json'],
  },

  externals: [
    {
      ws: 'WebSocket',
      stream: '{ Writable: function() {} }',
    },
    'dtrace-provider',
    'mv',
    'fs',
    'safe-json-stringify',
    'source-map-support',
  ],
};
