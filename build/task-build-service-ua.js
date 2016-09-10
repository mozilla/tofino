// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import colors from 'colors/safe';
import path from 'path';

import { BUILD_WEBPACK_CONFIGS_PATH } from './utils/const';
import { shouldRebuild } from './utils/rebuild';
import { webpackBuild } from './utils/webpack';
import { logger } from './logging';

export default async function(options) {
  const id = 'user agent service';
  const configPath = path.resolve(BUILD_WEBPACK_CONFIGS_PATH, 'webpack.services.ua');
  const { SRC_DIR } = require(configPath); // eslint-disable-line

  if (!(await shouldRebuild(id, SRC_DIR))) {
    logger.info(colors.green(`No changes in ${id}.`));
    return { close: () => {} };
  }

  logger.info(colors.cyan(`Building ${id}...`));
  return await webpackBuild(configPath, options);
}
