// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import webpack from 'webpack';
import contentConfig from './webpack.config.content.default';

export default {
  ...contentConfig,
  devtool: 'source-map',
  plugins: [
    ...contentConfig.plugins,
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
  ],
};
