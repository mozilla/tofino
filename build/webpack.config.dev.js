// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import webpack from 'webpack';
import defaultConfig from './webpack.config.default';

/**
 * Development config. Inspired by
 * https://github.com/gaearon/react-transform-boilerplate/blob/master/webpack.config.dev.js
 */
export default {
  ...defaultConfig,
  debug: true,
  devtool: 'source-map',
  output: {
    ...defaultConfig.output,
    pathinfo: true,
  },
  plugins: [
    ...(defaultConfig.plugins || []),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
    }),
    new webpack.NoErrorsPlugin(),
  ],
};
