// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import devConfig from './webpack.base.snippets.dev';
import contentConfig from './webpack.content.default';

export default {
  ...devConfig,
  ...contentConfig,
  output: {
    ...devConfig.output,
    ...contentConfig.output,
  },
  plugins: [
    ...devConfig.plugins,
    ...contentConfig.plugins,
  ],
};
