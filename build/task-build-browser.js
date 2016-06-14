// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import colors from 'colors/safe';
import { SRC_DIR, SHARED_DIR } from './webpack.config.browser.default';
import webpackProdConfig from './webpack.config.browser.prod';
import webpackDevConfig from './webpack.config.browser.dev';
import { shouldRebuild, getBuildConfig, webpackBuild } from './utils';
import { logger } from './logging';

export default async function() {
  const id = 'browser';

  const shouldRebuildSrc = await shouldRebuild(SRC_DIR, id);
  const shouldRebuildShared = await shouldRebuild(SHARED_DIR, 'ui/shared');

  if (!shouldRebuildSrc && !shouldRebuildShared) {
    logger.info(colors.green(`No changes in ${id}.`));
    return { close: () => {} };
  }

  logger.info(colors.cyan(`Building ${id}...`));
  const { development } = getBuildConfig();
  return await webpackBuild(development ? webpackDevConfig : webpackProdConfig);
}
