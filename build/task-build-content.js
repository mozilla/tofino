// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import colors from 'colors/safe';
import { SRC_DIR, SHARED_DIR } from './webpack.config.content.default';
import webpackProdConfig from './webpack.config.content.prod';
import webpackDevConfig from './webpack.config.content.dev';
import { shouldRebuild, getBuildConfig, webpackBuild } from './utils';
import { logger } from './logging';

export default async function() {
  const id = 'content';

  if (!(await shouldRebuild(id, [SRC_DIR, id], [SHARED_DIR, 'ui/shared']))) {
    logger.info(colors.green(`No changes in ${id}.`));
    return { close: () => {} };
  }

  logger.info(colors.cyan(`Building ${id}...`));
  const { development } = getBuildConfig();
  return await webpackBuild(development ? webpackDevConfig : webpackProdConfig);
}
