// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import devConfig from './webpack.base.snippets.dev';
import preloadConfig from './webpack.preload.default';

export default {
  ...devConfig,
  ...preloadConfig,
  output: {
    ...devConfig.output,
    ...preloadConfig.output,
  },
  plugins: [
    ...devConfig.plugins,
    ...preloadConfig.plugins,
  ],
};
