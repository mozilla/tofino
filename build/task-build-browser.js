// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import colors from 'colors/safe';
import fs from 'fs-promise';
import path from 'path';

import { BUILD_WEBPACK_CONFIGS_PATH, BROWSER_FRONTENDS_PATH } from './utils/const';
import { shouldRebuild } from './utils/rebuild';
import { webpackBuild } from './utils/webpack';
import { logger } from './logging';

export default async function(options) {
  const frontends = fs.readJsonSync(BROWSER_FRONTENDS_PATH);
  const builders = [];

  for (const id of frontends) {
    builders.push(await buildFrontend(id, options));
  }

  return {
    close: () => Promise.all(builders.map(w => w.close())),
  };
}

async function buildFrontend(id, options) {
  const configPath = path.resolve(BUILD_WEBPACK_CONFIGS_PATH, `webpack.${id}`);
  const { SRC_DIR, SHARED_DIR } = require(configPath); // eslint-disable-line

  if (!(await shouldRebuild(id, SRC_DIR, SHARED_DIR))) {
    logger.info(colors.green(`No changes in ${id}.`));
    return { close: () => {} };
  }

  logger.info(colors.cyan(`Building ${id}...`));
  return await webpackBuild(configPath, options);
}
