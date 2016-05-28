// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import path from 'path';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import defaultConfig, { root } from './webpack.config.default';

const shared = path.join(root, 'app', 'ui', 'shared');
const src = path.join(root, 'app', 'ui', 'content');
const dest = path.join(root, 'lib', 'ui', 'content');

export default {
  ...defaultConfig,
  entry: path.join(src, 'index.js'),
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
  ],
  target: 'web',
};
