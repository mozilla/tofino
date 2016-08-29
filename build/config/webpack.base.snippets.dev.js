// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import webpack from 'webpack';

export default {
  output: {
    pathinfo: true,
  },
  // Something in `fathom-web/utils.js` breaks when eval'd,
  // so don't use the 'eval' tool for now, even though it's a
  // cheaper sourcemap generator.
  devtool: 'cheap-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"development"',
    }),
  ],
};
