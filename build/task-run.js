// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/* eslint no-console: 0 */

import { exec } from 'child_process';
import path from 'path';

import * as BuildUtils from './utils';

export default env => new Promise((resolve, reject) => {
  const manifest = BuildUtils.getManifest();
  const command = `${BuildUtils.getElectronPath()} ${path.join(__dirname, '..', manifest.main)}`;
  const environ = {};
  if (env === 'production') {
    environ.NODE_ENV = 'production';
  }

  console.log(`Executing command: ${command}`);

  exec(command, { env: environ }, err => {
    if (err) {
      reject(err);
    }
    resolve();
  }).stdout.pipe(process.stdout);
});
