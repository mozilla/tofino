// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import { spawn } from 'child_process';
import path from 'path';
import os from 'os';

/* eslint no-console: 0 */

export default (args) => new Promise((resolve, reject) => {
  let command = path.join(__dirname, '..', 'node_modules', '.bin', 'mocha');
  if (os.type() === 'Windows_NT') {
    command += '.cmd';
  }

  console.log(`Executing command: ${command}`);

  const child = spawn(command, args, {
    stdio: 'inherit',
  });

  child.on('error', reject);
  child.on('exit', (code) => {
    if (code !== 0) {
      reject(new Error(`Exited with exit code ${code}`));
    } else {
      resolve();
    }
  });
});
