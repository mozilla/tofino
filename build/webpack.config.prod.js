import webpack from 'webpack';
import defaultConfig from './webpack.config.default';

/**
 * Production config. Inspired by
 * https://github.com/gaearon/react-transform-boilerplate/blob/master/webpack.config.prod.js
 */
module.exports = {
  ...defaultConfig,
  plugins: [
    ...(defaultConfig.plugins || []),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    /*
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
      },
    }),
    */
  ],
};
