// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import path from 'path';
import fs from 'fs-promise';
import colors from 'colors/safe';
import { SRC_DIR, LIB_DIR, BUILD_CONFIG_PATH } from './utils/const';
import { logger } from './logging';

function copy(src) {
  return fs.copy(src, path.join(LIB_DIR, path.basename(src)));
}

export default async function() {
  logger.info(colors.cyan('Building node environment...'));

  // copy node
  await copy(process.execPath);
  // copy package.json
  await copy(path.join(SRC_DIR, 'package.json'));
  // copy build-config.json
  await copy(BUILD_CONFIG_PATH);
  // copy node_modules
  await copy(path.join(SRC_DIR, 'node_modules'));

  return { close: () => {} };
}
