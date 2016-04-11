// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

const path = require('path');
const os = require('os');
const fs = require('fs');

const manifest = require('../package.json');

const IS_TRAVIS = exports.IS_TRAVIS = process.env.TRAVIS === 'true';
const IS_APPVEYOR = exports.IS_APPVEYOR = process.env.APPVETOR === 'True';

exports.getAppVersion = function getAppVersion() {
  return IS_TRAVIS ? `${manifest.version}-${process.env.TRAVIS_BUILD_NUMBER}` :
         IS_APPVEYOR ? `${manifest.version}-${process.env.APPVEYOR_BUILD_NUMBER}` :
         manifest.version;
};

function getElectronPath() {
  return require('electron-prebuilt');
};
exports.getElectronPath = getElectronPath;

exports.getElectronVersion = function getElectronVersion() {
  return manifest.devDependencies['electron-prebuilt'];
};
