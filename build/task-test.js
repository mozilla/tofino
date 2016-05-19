// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/
/* eslint no-console: 0 */

import path from 'path';
import { spawn, getElectronPath } from './utils';

const DEFAULT_UNIT_TESTS = path.join(__dirname, '..', 'test', 'unit');
const DEFAULT_RENDERER_TESTS = path.join(__dirname, '..', 'test', 'renderer');
const DEFAULT_WEBDRIVER_TESTS = path.join(__dirname, '..', 'test', 'webdriver');
const MOCHA = path.join(__dirname, '..', 'node_modules', '.bin', 'mocha');
const ELECTRON_MOCHA = path.join(__dirname, '..', 'node_modules', '.bin', 'electron-mocha');
const PATH_TO_ELECTRON_MOCHA_OPTS = path.join(__dirname, '..', 'test', 'renderer', 'mocha.opts');

export default async function(args) {
  // If no arguments passed in, we must run all tests; both mocha
  // and electron-mocha.
  if (!args.length) {
    await runMochaTests(DEFAULT_UNIT_TESTS);
    await runRendererTests(DEFAULT_RENDERER_TESTS);
    await runMochaTests(DEFAULT_WEBDRIVER_TESTS);
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

function runMochaTests(pathToTests) {
  return spawn(MOCHA, [pathToTests], {
    stdio: 'inherit',
  });
}

function runRendererTests(pathToTests) {
  return spawn(ELECTRON_MOCHA, [
    '--renderer',
    '--opts', PATH_TO_ELECTRON_MOCHA_OPTS,
    pathToTests,
  ], {
    stdio: 'inherit',
    env: {
      ELECTRON_PATH: getElectronPath(),
    },
  });
}
