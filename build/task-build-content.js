// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import webpackProdConfig from './webpack.config.content.prod';
import webpackDevConfig from './webpack.config.content.dev';
import { webpackBuild, getBuildConfig } from './utils';
import { logger } from './logging';

export default async function() {
  logger.info('Building content...');
  const { development } = getBuildConfig();
  return await webpackBuild(development ? webpackDevConfig : webpackProdConfig);
}
