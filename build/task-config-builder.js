// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/**
 * Creates a `build-config.json` in the root directory for runtime access to
 * build configurations.
 */

import os from 'os';

import * as BuildUtils from './utils';

export const BASE_CONFIG = {
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
  development: false,

  // Whether or not the build is packaged in an electron distributable
  packaged: false,

  // Whether or not the build is being tested
  test: false,

  // By default, user agent and content services are killed when the
  // application exits. Setting this to true will untie their lifetime
  // from the parent process lifetime.
  keepAliveAppServices: false,

  // The Google Analytics tracking identifier to use when instrumenting.
  googleAnalyticsTrackingID: 'UA-76122102-1',
};

export default function(options) {
  let currentConfig = {};

  try {
    currentConfig = BuildUtils.getBuildConfig();
  } catch (e) {
    // Ignore missing file errors.
  }

  const configToWrite = Object.assign({}, currentConfig, BASE_CONFIG, options);
  BuildUtils.writeBuildConfig(configToWrite);
}
