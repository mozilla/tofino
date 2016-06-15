// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import colors from 'colors/safe';
import * as BrowserDirs from './webpack.config.browser.default';
import browserProdConfig from './webpack.config.browser.prod';
import browserDevConfig from './webpack.config.browser.dev';
import * as PreloadDirs from './webpack.config.preload.default';
import preloadProdConfig from './webpack.config.preload.prod';
import preloadDevConfig from './webpack.config.preload.dev';
import { shouldRebuild, getBuildConfig, webpackBuild } from './utils';
import { logger } from './logging';

export default async function() {
  const { close: browserClose } = await buildBrowser();
  const { close: preloadClose } = await buildPreload();
  return {
    close: () => Promise.all([browserClose(), preloadClose()]),
  };
}

async function buildBrowser() {
  const id = 'browser';

  const shouldRebuildSrc = await shouldRebuild(BrowserDirs.SRC_DIR, id);
  const shouldRebuildShared = await shouldRebuild(BrowserDirs.SHARED_DIR, 'ui/shared');

  if (!shouldRebuildSrc && !shouldRebuildShared) {
    logger.info(colors.green(`No changes in ${id}.`));
    return { close: () => {} };
  }

  logger.info(colors.cyan(`Building ${id}...`));
  const { development } = getBuildConfig();
  return await webpackBuild(development ? browserDevConfig : browserProdConfig);
}

async function buildPreload() {
  const id = 'preload';

  if (!(await shouldRebuild(PreloadDirs.SRC_DIR, id))) {
    logger.info(colors.green(`No changes in ${id}.`));
    return { close: () => {} };
  }

  logger.info(colors.cyan(`Building ${id}...`));
  const { development } = getBuildConfig();
  return await webpackBuild(development ? preloadDevConfig : preloadProdConfig);
}
