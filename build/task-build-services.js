// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import colors from 'colors/safe';
import * as UAServiceDirs from './config/webpack.ua-service.default';
import * as ContentServiceDirs from './config/webpack.content-service.default';
import uaProdConfig from './config/webpack.ua-service.prod';
import uaDevConfig from './config/webpack.ua-service.dev';
import contentProdConfig from './config/webpack.content-service.prod';
import contentDevConfig from './config/webpack.content-service.dev';
import { getBuildConfig } from './utils';
import { shouldRebuild } from './utils/rebuild';
import { webpackBuild } from './utils/webpack';
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

  if (!(await shouldRebuild(id, [UAServiceDirs.SRC_DIR, id]))) {
    logger.info(colors.green(`No changes in ${id}.`));
    return { close: () => {} };
  }

  logger.info(colors.cyan(`Building ${id}...`));
  const { development } = getBuildConfig();
  return await webpackBuild(development ? uaDevConfig : uaProdConfig);
}

async function buildContentService() {
  const id = 'content service';

  if (!(await shouldRebuild(id, [ContentServiceDirs.SRC_DIR, id]))) {
    logger.info(colors.green(`No changes in ${id}.`));
    return { close: () => {} };
  }

  logger.info(colors.cyan(`Building ${id}...`));
  const { development } = getBuildConfig();
  return await webpackBuild(development ? contentDevConfig : contentProdConfig);
}
