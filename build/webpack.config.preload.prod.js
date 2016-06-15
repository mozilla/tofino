// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import prodConfig from './webpack.config.base.snippets.prod';
import preloadConfig from './webpack.config.preload.default';

export default {
  ...prodConfig,
  ...preloadConfig,
  plugins: [
    ...prodConfig.plugins,
    ...preloadConfig.plugins,
  ],
};
