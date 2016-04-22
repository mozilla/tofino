// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/**
 * Disable eslint "import" rules, since it cannot handle importing directly
 * from .json files, which we do in fact support through node.
 */
/* eslint-disable import/namespace, import/default, import/no-named-as-default */

import os from 'os';
import path from 'path';
import manifest from '../package.json';
import electronPath from 'electron-prebuilt';
import fs from 'fs-promise';
import mz from 'mz';

export const IS_TRAVIS = process.env.TRAVIS === 'true';
export const IS_APPVEYOR = process.env.APPVETOR === 'True';

export const getAppVersion = () => {
  if (IS_TRAVIS) {
    return `${manifest.version}-${process.env.TRAVIS_BUILD_NUMBER}`;
  }
  if (IS_APPVEYOR) {
    return `${manifest.version}-${process.env.APPVEYOR_BUILD_NUMBER}`;
  }
  return manifest.version;
};

export const getManifest = () => manifest;

export const getElectronPath = () => electronPath;

export const getElectronVersion = () => manifest.devDependencies['electron-prebuilt'];

const platformPath = {
  win32: ['tofino.exe'],
  darwin: ['tofino.app', 'Contents', 'MacOS', 'tofino'],
  linux: ['tofino'],
};

export const getBuiltExecutable = () => {
  const cwd = path.join(__dirname, '..', 'dist', `tofino-${os.platform()}-x64`);
  const fullPath = path.join(cwd, ...platformPath[os.platform()]);
  return { cwd, fullPath };
};

export async function spawn(command, args, options = {}) {
  if (os.type() === 'Windows_NT') {
    try {
      // Prefer a cmd version if available
      const testCommand = `${command}.cmd`;
      const stats = await fs.stat(testCommand);
      if (stats.isFile()) {
        command = testCommand;
      }
    } catch (e) {
      // Ignore missing files.
    }
  }

  return new Promise((resolve, reject) => {
    const child = mz.child_process.spawn(command, args, options);

    child.on('error', reject);
    child.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Exited with exit code ${code}`));
      } else {
        resolve();
      }
    });
  });
}
