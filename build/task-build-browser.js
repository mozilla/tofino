// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import colors from 'colors/safe';
import * as BrowserDirs from './config/webpack.browser.default';
import browserProdConfig from './config/webpack.browser.prod';
import browserDevConfig from './config/webpack.browser.dev';
import * as PreloadDirs from './config/webpack.preload.default';
import preloadProdConfig from './config/webpack.preload.prod';
import preloadDevConfig from './config/webpack.preload.dev';
import { getBuildConfig } from './utils';
import { shouldRebuild } from './utils/rebuild';
import { webpackBuild } from './utils/webpack';
import { logger } from './logging';

export default async function() {
  const { close: browserClose } = await buildBrowser();
  const { close: preloadClose } = await buildPreload();
  return {
    close: () => Promise.all([browserClose(), preloadClose()]),
  };
}

async function buildBrowser() {
  const { SRC_DIR, SHARED_DIR } = BrowserDirs;
  const id = 'browser';

  if (!(await shouldRebuild(id, [SRC_DIR, id], [SHARED_DIR, 'ui/shared']))) {
    logger.info(colors.green(`No changes in ${id}.`));
    return { close: () => {} };
  }

  logger.info(colors.cyan(`Building ${id}...`));
  const { development } = getBuildConfig();
  return await webpackBuild(development ? browserDevConfig : browserProdConfig);
}

async function buildPreload() {
  const id = 'preload';

  if (!(await shouldRebuild(id, [PreloadDirs.SRC_DIR, id]))) {
    logger.info(colors.green(`No changes in ${id}.`));
    return { close: () => {} };
  }

  logger.info(colors.cyan(`Building ${id}...`));
  const { development } = getBuildConfig();
  return await webpackBuild(development ? preloadDevConfig : preloadProdConfig);
}
