// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import webpack from 'webpack';
import path from 'path';

export const root = path.join(__dirname, '..');

export default {
  context: root,
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
    }, {
      test: /\.json$/,
      loader: 'json',
    }],
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.json'],
  },
  devtool: 'source-map',
  plugins: [
    new webpack.NoErrorsPlugin(),
  ],
};
