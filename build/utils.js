// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

'use strict';

const manifest = require('../package.json');

const IS_TRAVIS = exports.IS_TRAVIS = process.env.TRAVIS === 'true';
const IS_APPVEYOR = exports.IS_APPVEYOR = process.env.APPVETOR === 'True';

exports.getAppVersion = () => {
  if (IS_TRAVIS) {
    return `${manifest.version}-${process.env.TRAVIS_BUILD_NUMBER}`;
  }
  if (IS_APPVEYOR) {
    return `${manifest.version}-${process.env.APPVEYOR_BUILD_NUMBER}`;
  }
  return manifest.version;
};

exports.getElectronPath = () => require('electron-prebuilt');

exports.getElectronVersion = () => manifest.devDependencies['electron-prebuilt'];
