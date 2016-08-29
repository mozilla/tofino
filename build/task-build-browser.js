// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import colors from 'colors/safe';
import fs from 'fs-promise';

import { BROWSER_FRONTENDS_PATH } from './utils/const';
import { makeDevConfig as dev, makeProdConfig as prod } from './config/webpack.base';
import { getBuildConfig } from './utils';
import { shouldRebuild } from './utils/rebuild';
import { webpackBuild } from './utils/webpack';
import { logger } from './logging';

export default async function() {
  const frontends = fs.readJsonSync(BROWSER_FRONTENDS_PATH);
  const watchers = [];

  for (const id of frontends) {
    watchers.push(await buildFrontend(id));
  }

  return {
    close: () => Promise.all(watchers.map(w => w.close())),
  };
}

async function buildFrontend(id) {
  /* eslint-disable global-require */
  const { default: browserConfig, SRC_DIR, SHARED_DIR } = require(`./config/webpack.${id}`);
  /* eslint-enable global-require */

  if (!(await shouldRebuild(id, SRC_DIR, SHARED_DIR))) {
    logger.info(colors.green(`No changes in ${id}.`));
    return { close: () => {} };
  }

  logger.info(colors.cyan(`Building ${id}...`));
  const { development } = getBuildConfig();
  return await webpackBuild(development ? dev(browserConfig) : prod(browserConfig));
}
