// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import devConfig from './webpack.config.base.snippets.dev';
import mainProcessConfig from './webpack.config.main.default';

export default {
  ...devConfig,
  ...mainProcessConfig,
  output: {
    ...devConfig.output,
    ...mainProcessConfig.output,
  },
  plugins: [
    ...devConfig.plugins,
    ...mainProcessConfig.plugins,
  ],
};
