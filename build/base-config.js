// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import os from 'os';
import * as BuildUtils from './utils';

export default {
  // System information
  platform: os.platform(),
  arch: 'x64',

  // Electron information
  electron: BuildUtils.getElectronVersion(),

  // Version number, with extra build numbers if in a CI environment
  version: BuildUtils.getAppVersion(),

  // The `development` option indicates whether or not the build is
  // using hot reloading and unminified content and other things like that.
  development: false,

  // Whether or not the build is being tested
  test: false,
};
