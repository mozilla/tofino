// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import webpack from 'webpack';
import defaultConfig from './webpack.config.default';
import { mapObject } from '../shared/util';

/**
 * Development config. Inspired by
 * https://github.com/gaearon/react-transform-boilerplate/blob/master/webpack.config.dev.js
 */
module.exports = {
  ...defaultConfig,
  debug: true,
  devtool: 'source-map',
  entry: mapObject(defaultConfig.entry, ([name, sources]) => {
    const newSources = [
      'webpack-hot-middleware/client?reload=true',
      ...sources,
    ];
    return [name, newSources];
  }),
  output: {
    ...defaultConfig.output,
    pathinfo: true,
  },
  plugins: [
    ...(defaultConfig.plugins || []),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
    }),
    new webpack.NoErrorsPlugin(),
  ],
};
