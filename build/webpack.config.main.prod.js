// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import webpack from 'webpack';
import mainProcessConfig from './webpack.config.main.default';

export default {
  ...mainProcessConfig,
  devtool: 'source-map',
  plugins: [
    ...mainProcessConfig.plugins,
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
  ],
};
