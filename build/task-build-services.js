// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import uaProdConfig from './webpack.config.ua-service.prod';
import uaDevConfig from './webpack.config.ua-service.dev';
import contentProdConfig from './webpack.config.content-service.prod';
import contentDevConfig from './webpack.config.content-service.dev';
import { webpackBuild, getBuildConfig } from './utils';
import { logger } from './logging';

export default async function() {
  const { development } = getBuildConfig();
  logger.info('Building UA service...');
  const { close: uaClose } = await webpackBuild(development ? uaDevConfig : uaProdConfig);
  logger.info('Building content service...');
  const { close: contentClose } =
    await webpackBuild(development ? contentDevConfig : contentProdConfig);

  return {
    close: () => Promise.all([uaClose(), contentClose()]),
  };
}
