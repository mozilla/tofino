// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/**
 * Creates a `build-config.js` in root directory for runtime access to
 * build configurations.
 */

import path from 'path';
import os from 'os';
import fs from 'fs';

import * as BuildUtils from './utils';

const BASE_CONFIG = {
  // System information
  platform: os.platform(),
  arch: 'x64',

  // Electron information
  electron: BuildUtils.getElectronVersion(),

  // Other environment settings

  // Version number, with extra build numbers if in a CI environment
  version: BuildUtils.getAppVersion(),

  // If this build occurred on Travis CI
  travis: BuildUtils.IS_TRAVIS,

  // If this build occurred on Appveyor
  appveyor: BuildUtils.IS_APPVEYOR,

  // The `development` option indicates whether or not the build is
  // using hot reloading and unminified content and other things like that.
  development: true,

  // Whether or not the build is packaged in an electron distributable
  packaged: false,

  // The Google Analytics tracking identifier to use when instrumenting.
  googleAnalyticsTrackingID: 'UA-76122102-1',
};

export default config => new Promise((resolve, reject) => {
  const configToWrite = Object.assign({}, BASE_CONFIG, config);
  const content = [];

  for (const [key, value] of Object.entries(configToWrite)) {
    content.push(`export const ${key} = '${value}';\n`);
  }

  fs.writeFile(path.join(__dirname, '..', 'build-config.js'), content.join(''), err => {
    if (err) {
      reject(err);
    }
    resolve();
  });
});
