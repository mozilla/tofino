// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import colors from 'colors/safe';
import * as BrowserDirs1 from './config/webpack.browser.default';
import browserProdConfig1 from './config/webpack.browser.prod';
import browserDevConfig1 from './config/webpack.browser.dev';

import * as BrowserDirs2 from './config/webpack.browser2.default';
import browserProdConfig2 from './config/webpack.browser2.prod';
import browserDevConfig2 from './config/webpack.browser2.dev';

import * as PreloadDirs from './config/webpack.preload.default';
import preloadProdConfig from './config/webpack.preload.prod';
import preloadDevConfig from './config/webpack.preload.dev';

import { getBuildConfig } from './utils';
import { shouldRebuild } from './utils/rebuild';
import { webpackBuild } from './utils/webpack';
import { logger } from './logging';

export default async function() {
  const { close: browserClose1 } = await buildBrowser1();
  const { close: browserClose2 } = await buildBrowser2();
  const { close: preloadClose } = await buildPreload();
  return {
    close: () => Promise.all([browserClose1(), browserClose2(), preloadClose()]),
  };
}

async function buildBrowser1() {
  const { SRC_DIR, SHARED_DIR } = BrowserDirs1;
  const id = 'browser';

  if (!(await shouldRebuild(id, [SRC_DIR, id], [SHARED_DIR, 'ui/shared']))) {
    logger.info(colors.green(`No changes in ${id}.`));
    return { close: () => {} };
  }

  logger.info(colors.cyan(`Building ${id}...`));
  const { development } = getBuildConfig();
  return await webpackBuild(development ? browserDevConfig1 : browserProdConfig1);
}

async function buildBrowser2() {
  const { SRC_DIR, SHARED_DIR } = BrowserDirs2;
  const id = 'browser2';

  if (!(await shouldRebuild(id, [SRC_DIR, id], [SHARED_DIR, 'ui/shared']))) {
    logger.info(colors.green(`No changes in ${id}.`));
    return { close: () => {} };
  }

  logger.info(colors.cyan(`Building ${id}...`));
  const { development } = getBuildConfig();
  return await webpackBuild(development ? browserDevConfig2 : browserProdConfig2);
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
