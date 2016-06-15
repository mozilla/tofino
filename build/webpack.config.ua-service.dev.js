// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import devConfig from './webpack.config.base.snippets.dev';
import uaServiceConfig from './webpack.config.ua-service.default';

export default {
  ...devConfig,
  ...uaServiceConfig,
  output: {
    ...devConfig.output,
    ...uaServiceConfig.output,
  },
  plugins: [
    ...devConfig.plugins,
    ...uaServiceConfig.plugins,
  ],
};
