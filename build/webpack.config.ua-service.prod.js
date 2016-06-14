// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import webpack from 'webpack';
import uaServiceConfig from './webpack.config.ua-service.default';

export default {
  ...uaServiceConfig,
  devtool: 'source-map',
  plugins: [
    ...uaServiceConfig.plugins,
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
  ],
};
