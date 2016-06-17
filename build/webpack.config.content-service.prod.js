// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import prodConfig from './webpack.config.base.snippets.prod';
import contentServiceConfig from './webpack.config.content-service.default';

export default {
  ...prodConfig,
  ...contentServiceConfig,
  plugins: [
    ...prodConfig.plugins,
    ...contentServiceConfig.plugins,
  ],
};
