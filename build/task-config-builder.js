// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

'use strict';

/**
 * Builds a `build-config.js` in root directory for runtime access to build configurations.
 */

const path = require('path');
const os = require('os');
const fs = require('fs');

const buildUtils = require('./utils');

const BASE_CONFIG = {
  // System information
  platform: os.platform(),
  arch: 'x64',

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

  // The Google Analytics tracking identifier to use when instrumenting.
  googleAnalyticsTrackingID: 'UA-76122102-1',
};

module.exports = config => new Promise((resolve, reject) => {
  const configToWrite = Object.assign({}, BASE_CONFIG, config);
  const content = `module.exports = ${JSON.stringify(configToWrite, null, 2)}`;

  fs.writeFile(path.join(__dirname, '..', 'build-config.js'), content, err => {
    if (err) {
      reject(err);
    }
    resolve();
  });
});
