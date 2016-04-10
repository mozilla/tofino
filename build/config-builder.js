// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/**
 * Builds a `build-config.js` in root directory for runtime access to build configurations.
 */


const path = require('path');
const os = require('os');
const fs = require('fs');

const buildUtils = require('./utils');

const platform = os.platform();
const arch = 'x64';


const BASE_CONFIG = {
  // System information
  platform,
  arch,

  // Electron information
  electron: buildUtils.getElectronVersion(),

  // Other environment settings

  // Version number, with extra build numbers if in a CI environment
  version: buildUtils.getAppVersion,

  // If this build occurred on Travis CI
  travis: buildUtils.IS_TRAVIS,

  // If this build occurred on Appveyor
  appveyor: buildUtils.IS_APPVEYOR,

  // The `development` option indicates whether or not the build is
  // using hot reloading and unminified content and other things like that.
  development: true,

  // Whether or not the build is packaged in an electron distributable
  packaged: false,
};

exports.buildConfig = function(config, fileName='build-config.js') {
  let configToWrite = Object.assign({}, BASE_CONFIG, config);

  let content = `module.exports = ${JSON.stringify(configToWrite, null, 2)}`;

  fs.writeFileSync(path.join(__dirname, '..', fileName), content);
  return configToWrite;
};
