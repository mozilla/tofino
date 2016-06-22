// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import prodConfig from './webpack.base.snippets.prod';
import browserConfig from './webpack.browser2.default';

export default {
  ...prodConfig,
  ...browserConfig,
  plugins: [
    ...prodConfig.plugins,
    ...browserConfig.plugins,
  ],
};
