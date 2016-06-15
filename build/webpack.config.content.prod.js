// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import prodConfig from './webpack.config.base.snippets.prod';
import contentConfig from './webpack.config.content.default';

export default {
  ...prodConfig,
  ...contentConfig,
  plugins: [
    ...prodConfig.plugins,
    ...contentConfig.plugins,
  ],
};
