// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import colors from 'colors/safe';
import path from 'path';

import * as Const from './utils/const';
import { getAppManifest } from './utils';
import { getElectronPath } from './utils/electron';
import { spawn } from './utils/process';
import { logger } from './logging';

export default async function(args = []) {
  const manifest = getAppManifest();
  const command = getElectronPath();
  const script = path.join(Const.LIB_DIR, manifest.main);

  logger.info(colors.cyan('Executing'), colors.gray(command));

  await spawn(command, [script, ...args], {
    stdio: 'inherit',
  });
}
