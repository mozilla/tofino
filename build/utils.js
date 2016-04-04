// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

const path = require('path');
const os = require('os');

const manifest = require('../package.json');

const IS_TRAVIS = exports.IS_TRAVIS = process.env.TRAVIS === 'true';
const IS_APPVEYOR = exports.IS_APPVEYOR = process.env.APPVETOR === 'True';

const electronDir = path.join(__dirname, '..', 'electron');
const electronPaths = {
  darwin: path.join(electronDir, 'Electron.app', 'Contents', 'MacOS', 'Electron'),
  freebsd: path.join(electronDir, 'electron'),
  linux: path.join(electronDir, 'electron'),
  win32: path.join(electronDir, 'electron.exe'),
};

exports.getAppVersion = function getAppVersion() {
  return IS_TRAVIS ? `${manifest.version}-${process.env.TRAVIS_BUILD_NUMBER}` :
         IS_APPVEYOR ? `${manifest.version}-${process.env.APPVEYOR_BUILD_NUMBER}` :
         manifest.version;
};

exports.getElectronPath = function getElectronPath() {
  return electronPaths[os.platform()];
};
