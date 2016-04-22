// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import { spawn } from './utils';
import path from 'path';

/* eslint no-console: 0 */

export default async function(args) {
  const command = path.join(__dirname, '..', 'node_modules', '.bin', 'mocha');

  console.log(`Executing command: ${command}`);

  await spawn(command, args, {
    stdio: 'inherit',
  });
}
