// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import webpack from 'webpack';
import path from 'path';
import * as Const from '../utils/const';

const root = Const.ROOT;

export default {
  output: {},
  module: {
    loaders: [{
      test: /\.jsx?$/,
      include: [path.join(root, 'app')],
      exclude: [path.join(root, 'app', 'node_modules')],
      loader: 'babel-loader',
    }, {
      test: /\.json$/,
      loader: 'json',
    }],
  },
  resolve: {
    root,
    extensions: ['', '.js', '.jsx', '.json'],
  },
  plugins: [
    // Need to use webpack's old watcher implementation, because the new one
    // doesn't remove everything from the node's event loop after closing it,
    // keeping the owning process running even after the application exits.
    new webpack.OldWatchingPlugin(),
    new webpack.NoErrorsPlugin(),
  ],
  externals: [
    'dtrace-provider',
  ],
};
