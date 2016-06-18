// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import prodConfig from './webpack.base.snippets.prod';
import mainProcessConfig from './webpack.main.default';

export default {
  ...prodConfig,
  ...mainProcessConfig,
  plugins: [
    ...prodConfig.plugins,
    ...mainProcessConfig.plugins,
  ],
};
