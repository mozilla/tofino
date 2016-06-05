// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import webpack from 'webpack';
import path from 'path';
import * as BuildUtils from './utils';

const root = BuildUtils.getRoot();

export default {
  module: {
    loaders: [{
      test: /\.jsx?$/,
      include: [path.join(root, 'app')],
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
};
