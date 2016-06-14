// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import { SRC_DIR, SHARED_DIR } from './webpack.config.content.default';
import webpackProdConfig from './webpack.config.content.prod';
import webpackDevConfig from './webpack.config.content.dev';
import { shouldRebuild, getBuildConfig, webpackBuild } from './utils';
import { logger } from './logging';

export default async function() {
  const id = 'content';

  const shouldRebuildSrc = await shouldRebuild(SRC_DIR, id);
  const shouldRebuildShared = await shouldRebuild(SHARED_DIR, 'ui/shared');

  if (!shouldRebuildSrc && !shouldRebuildShared) {
    logger.info(`No changes in ${id}.`);
    return { close: () => {} };
  }

  logger.info(`Building ${id}...`);
  const { development } = getBuildConfig();
  return await webpackBuild(development ? webpackDevConfig : webpackProdConfig);
}
