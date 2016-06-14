// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import * as UAServiceDirs from './webpack.config.ua-service.default';
import * as ContentServiceDirs from './webpack.config.content-service.default';
import uaProdConfig from './webpack.config.ua-service.prod';
import uaDevConfig from './webpack.config.ua-service.dev';
import contentProdConfig from './webpack.config.content-service.prod';
import contentDevConfig from './webpack.config.content-service.dev';
import { shouldRebuild, getBuildConfig, webpackBuild } from './utils';
import { logger } from './logging';

export default async function() {
  const { close: uaClose } = await buildUAService();
  const { close: contentClose } = await buildContentService();
  return {
    close: () => Promise.all([uaClose(), contentClose()]),
  };
}

async function buildUAService() {
  const id = 'user agent service';

  if (!(await shouldRebuild(UAServiceDirs.SRC_DIR, id))) {
    logger.info(`No changes in ${id}.`);
    return { close: () => {} };
  }

  logger.info(`Building ${id}...`);
  const { development } = getBuildConfig();
  return await webpackBuild(development ? uaProdConfig : uaDevConfig);
}

async function buildContentService() {
  const id = 'content service';

  if (!(await shouldRebuild(ContentServiceDirs.SRC_DIR, id))) {
    logger.info(`No changes in ${id}.`);
    return { close: () => {} };
  }

  logger.info(`Building ${id}...`);
  const { development } = getBuildConfig();
  return await webpackBuild(development ? contentProdConfig : contentDevConfig);
}
