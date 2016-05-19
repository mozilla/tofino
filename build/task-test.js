// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/
/* eslint no-console: 0 */

import { spawn, getElectronPath } from './utils';
import path from 'path';

const MOCHA_TEST_DIRS = ['unit', 'lint', 'webdriver'];
const TEST_DIR = path.join(__dirname, '..', 'test');
const DEFAULT_MOCHA_TESTS = path.join(TEST_DIR, `+(${MOCHA_TEST_DIRS.join('|')})`, '**', '*.js');
const DEFAULT_RENDERER_TESTS = path.join(TEST_DIR, 'renderer', '**', '*.js');

export default async function(args) {
  // If no arguments passed in, we must run all tests; both mocha
  // and electron-mocha.
  if (!args.length) {
    await runMochaTests();
    await runRendererTests();
  } else {
    // If we get a path passed in, crudely check if we should run
    // our renderer tests, or normal mocha tests. This will fail for complex
    // globbing, but this is more than fine for now.
    const pathToTests = args[0];
    if (pathToTests.indexOf(path.join('test', 'renderer')) !== -1) {
      await runRendererTests(pathToTests);
    } else {
      await runMochaTests(pathToTests);
    }
  }
}

function runMochaTests(pathToTests = DEFAULT_MOCHA_TESTS) {
  const command = path.join(__dirname, '..', 'node_modules', '.bin', 'mocha');

  return spawn(command, [pathToTests], {
    stdio: 'inherit',
  });
}

function runRendererTests(pathToTests = DEFAULT_RENDERER_TESTS) {
  const command = path.join(__dirname, '..', 'node_modules', '.bin', 'electron-mocha');
  const pathToOptions = path.join(__dirname, '..', 'test', 'renderer', 'mocha.opts');

  return spawn(command, [
    '--renderer',
    '--opts', pathToOptions,
    pathToTests,
  ], {
    stdio: 'inherit',
    env: {
      ELECTRON_PATH: getElectronPath(),
    },
  });
}
