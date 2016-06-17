// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import devConfig from './webpack.config.base.snippets.dev';
import contentServiceConfig from './webpack.config.content-service.default';

export default {
  ...devConfig,
  ...contentServiceConfig,
  output: {
    ...devConfig.output,
    ...contentServiceConfig.output,
  },
  plugins: [
    ...devConfig.plugins,
    ...contentServiceConfig.plugins,
  ],
};
