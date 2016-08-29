// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import colors from 'colors/safe';
import { default as mainProcessConfig, SRC_DIR } from './config/webpack.main';
import { makeDevConfig as dev, makeProdConfig as prod } from './config/webpack.base';
import { getBuildConfig } from './utils';
import { shouldRebuild } from './utils/rebuild';
import { webpackBuild } from './utils/webpack';
import { logger } from './logging';

export default async function() {
  const id = 'main process';

  if (!(await shouldRebuild(id, SRC_DIR))) {
    logger.info(colors.green(`No changes in ${id}.`));
    return { close: () => {} };
  }

  logger.info(colors.cyan(`Building ${id}...`));
  const { development } = getBuildConfig();
  return await webpackBuild(development ? dev(mainProcessConfig) : prod(mainProcessConfig));
}
