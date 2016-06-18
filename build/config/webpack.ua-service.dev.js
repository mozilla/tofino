// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import devConfig from './webpack.base.snippets.dev';
import uaServiceConfig from './webpack.ua-service.default';

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
