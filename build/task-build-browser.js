// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import colors from 'colors/safe';
import * as PreloadDirs from './config/webpack.preload.default';
import preloadProdConfig from './config/webpack.preload.prod';
import preloadDevConfig from './config/webpack.preload.dev';

import * as browserConfig from './config/webpack.browser.default';
import * as browserAltConfig from './config/webpack.browseralt.default';

import { getBuildConfig } from './utils';
import { shouldRebuild } from './utils/rebuild';
import { webpackBuild } from './utils/webpack';
import { logger } from './logging';

export default async function() {
  const { close: browserClose } = await buildBrowser();
  const { close: browserAltClose } = await buildBrowserAlt();
  const { close: preloadClose } = await buildPreload();
  return {
    close: () => Promise.all([browserClose(), browserAltClose(), preloadClose()]),
  };
}

async function buildBrowser() {
  const { SRC_DIR, SHARED_DIR } = browserConfig;
  const id = 'browser';

  if (!(await shouldRebuild(id, [SRC_DIR, id], [SHARED_DIR, 'browser ui/shared']))) {
    logger.info(colors.green(`No changes in ${id}.`));
    return { close: () => {} };
  }

  logger.info(colors.cyan(`Building ${id}...`));
  const { development } = getBuildConfig();
  return await webpackBuild(development ? browserConfig.dev : browserConfig.prod);
}

async function buildBrowserAlt() {
  const { SRC_DIR, SHARED_DIR } = browserAltConfig;
  const id = 'browser-alt';

  if (!(await shouldRebuild(id, [SRC_DIR, id], [SHARED_DIR, 'browser-alt ui/shared']))) {
    logger.info(colors.green(`No changes in ${id}.`));
    return { close: () => {} };
  }

  logger.info(colors.cyan(`Building ${id}...`));
  const { development } = getBuildConfig();
  return await webpackBuild(development ? browserAltConfig.dev : browserAltConfig.prod);
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
