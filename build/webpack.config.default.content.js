// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import path from 'path';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import defaultConfig, { root } from './webpack.config.default';

export default {
  ...defaultConfig,
  entry: path.join(root, 'app', 'ui', 'content', 'index.js'),
  output: {
    path: path.join(root, 'lib', 'ui', 'content'),
    filename: 'index.js',
    sourceMapFilename: 'index.map',
  },
  plugins: [
    ...defaultConfig.plugins,
    new CopyWebpackPlugin([{
      from: path.join(root, 'app', 'ui', 'content', '*.html'),
      to: path.join(root, 'lib', 'ui', 'content'),
      flatten: true,
    }]),
  ],
  target: 'web',
};
