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
