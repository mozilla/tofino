// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import webpack from 'webpack';
import path from 'path';
import devConfig from './webpack.base.snippets.dev';
import prodConfig from './webpack.base.snippets.prod';
import * as Const from '../utils/const';

const root = Const.ROOT;

export default {
  output: {
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      include: [
        path.join(root, 'app'),
      ],
      exclude: [
        path.join(root, 'node_modules'),
        path.join(root, 'app', 'node_modules'),
      ],
      loader: 'babel-loader',
    }, {
      test: /\.json$/,
      loader: 'json',
    }],
  },
  resolve: {
    root,
    extensions: ['', '.js', '.jsx', '.json'],
    alias: {
      'dtrace-provider': path.join(Const.BUILD_SYSTEM_DIR, 'utils', 'empty_module.js'),
      'app/shared/environment': path.join(Const.BUILD_SYSTEM_DIR, 'utils', 'empty_module.js'),
    },
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.TEST': process.env.TEST,
    }),
  ],
  externals: [
  ],
};

export const makeDevConfig = baseConfig => ({
  ...devConfig,
  ...baseConfig,
  output: {
    ...devConfig.output,
    ...baseConfig.output,
  },
  plugins: [
    ...devConfig.plugins,
    ...baseConfig.plugins,
  ],
});

export const makeProdConfig = baseConfig => ({
  ...prodConfig,
  ...baseConfig,
  plugins: [
    ...prodConfig.plugins,
    ...baseConfig.plugins,
  ],
});
