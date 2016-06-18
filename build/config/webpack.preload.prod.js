// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import prodConfig from './webpack.base.snippets.prod';
import preloadConfig from './webpack.preload.default';

export default {
  ...prodConfig,
  ...preloadConfig,
  plugins: [
    ...prodConfig.plugins,
    ...preloadConfig.plugins,
  ],
};
