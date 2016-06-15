// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import prodConfig from './webpack.config.base.snippets.prod';
import browserConfig from './webpack.config.browser.default';

export default {
  ...prodConfig,
  ...browserConfig,
  plugins: [
    ...prodConfig.plugins,
    ...browserConfig.plugins,
  ],
};
