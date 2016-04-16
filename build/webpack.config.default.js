// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import path from 'path';

/**
 * The intent is that this config is kept as simple as possible - just the
 * minimum needed to build, without development or production optimizations.
 *
 * Changes for running in development/live are made in webpack.config.{dev|prod}.js
 */
const root = path.join(__dirname, '..');

export default {
  entry: {
    browser: ['babel-polyfill', path.join(root, 'ui', 'browser', 'index.js')],
  },
  context: root,
  output: {
    path: path.join(root, 'lib', 'ui'),
    filename: '[name].js',
    sourceMapFilename: '[file].map',
  },
  module: {
    loaders: [
      { test: /\.json$/, loader: 'json' },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: [
          path.join(root, 'ui'),
          path.join(root, 'shared'),
        ],
      },
    ],
  },
  target: 'atom',
  plugins: [
  ],
};
