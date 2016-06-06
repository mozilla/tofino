// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import path from 'path';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import defaultConfig from './webpack.config.base';
import * as Const from './const';

const shared = path.join(Const.SRC_DIR, 'ui', 'shared');
const src = path.join(Const.SRC_DIR, 'ui', 'browser');
const dest = path.join(Const.BUILD_DIR, 'ui', 'browser');

export default {
  ...defaultConfig,
  entry: path.join(src, 'index.jsx'),
  output: {
    path: dest,
    filename: 'index.js',
    sourceMapFilename: 'index.map',
  },
  plugins: [
    ...defaultConfig.plugins,
    new CopyWebpackPlugin([{
      from: path.join(src, '*.html'),
      to: dest,
      flatten: true,
    }]),
    new CopyWebpackPlugin([{
      from: path.join(src, 'css', '*.css'),
      to: path.join(dest, 'css'),
      flatten: true,
    }]),
    new CopyWebpackPlugin([{
      from: path.join(shared, 'css', '*.css'),
      to: path.join(dest, 'css'),
      flatten: true,
    }]),
    new CopyWebpackPlugin([{
      from: path.join(shared, 'assets'),
      to: path.join(dest, 'assets'),
      flatten: true,
    }]),
    new CopyWebpackPlugin([{
      from: path.join(shared, 'fonts'),
      to: path.join(dest, 'fonts'),
      flatten: true,
    }]),
  ],
  target: 'electron-renderer',
};
