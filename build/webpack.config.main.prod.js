// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import prodConfig from './webpack.config.base.snippets.prod';
import mainProcessConfig from './webpack.config.main.default';

export default {
  ...prodConfig,
  ...mainProcessConfig,
  plugins: [
    ...prodConfig.plugins,
    ...mainProcessConfig.plugins,
  ],
};
