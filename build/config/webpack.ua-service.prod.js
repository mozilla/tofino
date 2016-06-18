// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import prodConfig from './webpack.base.snippets.prod';
import uaServiceConfig from './webpack.ua-service.default';

export default {
  ...prodConfig,
  ...uaServiceConfig,
  plugins: [
    ...prodConfig.plugins,
    ...uaServiceConfig.plugins,
  ],
};
