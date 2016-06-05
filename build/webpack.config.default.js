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
    new webpack.NoErrorsPlugin(),
  ],
};
