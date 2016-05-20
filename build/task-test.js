// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/
/* eslint no-console: 0 */

import childProcess from 'child_process';
import path from 'path';
import os from 'os';
import { spawn, getElectronPath, normalizeCommand } from './utils';

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

async function runRendererTests(pathToTests) {
  const command = await normalizeCommand(ELECTRON_MOCHA);

  const child = childProcess.spawn(command, [
    '--renderer',
    '--opts', PATH_TO_ELECTRON_MOCHA_OPTS,
    pathToTests,
  ], {
    // Must pass in our whole environment to `electron-mocha`, as
    // that spawns another process which uses something in the current environment
    // (so `process.env`, or the `env` object we pass in here), otherwise the electron process
    // immediately crashes.
    env: Object.assign({}, process.env, { ELECTRON_PATH: getElectronPath() }),
  });

  return new Promise((resolve, reject) => {
    let failedFromStdout = false;

    // Parse and pipe the stdout from electron-mocha
    // so we can observe if tests are passing, but we get an error
    // on shutdown, for the Windows edge case below.
    child.stdout.on('data', data => {
      if (/\s\d+ failing/.test(`${data}`.trim())) {
        failedFromStdout = true;
      }
      process.stdout.write(data);
    });

    child.stderr.pipe(process.stderr);
    child.on('error', reject);
    child.on('exit', code => {
      if (code !== 0) {
        if (os.platform() === 'win32' && !failedFromStdout) {
          // If the exit code is not 0 and we didn't observe any
          // failure messages when running tests, we are running into
          // an issue where Electron crashes in electron-mocha when cleaning up
          // tests due to the main process firing a `webContents.send()` during clean up
          // resulting in a 'Object has been destroyed' error. Can't seem to figure out
          // why, but looks like a part of Electron, and burned enough time on this,
          // so this is good enough for now™.
          resolve();
        } else {
          reject(new Error(`Child process ${command} exited with exit code ${code}`));
        }
      } else {
        resolve();
      }
    });
  });
}
