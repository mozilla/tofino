// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/**
 * Disable eslint "import" rules, since it cannot handle importing directly
 * from .json files, which we do in fact support through webpack.
 */
/* eslint-disable import/namespace, import/default, import/no-named-as-default */

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
