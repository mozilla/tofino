// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import colors from 'colors/safe';
import path from 'path';

import * as BuildUtils from './utils';
import { logger } from './logging';

export default async function(args = []) {
  const manifest = BuildUtils.getManifest();
  const command = BuildUtils.getElectronPath();
  const script = path.join(__dirname, '..', manifest.main);

  logger.info(colors.cyan('Executing'), colors.gray(command));

  await BuildUtils.spawn(command, [script, ...args], {
    stdio: 'inherit',
  });
}
