// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import os from 'os';
import { getElectronVersion } from './electron';
import { getManifest } from './';

export default {
  // System information
  platform: os.platform(),
  arch: 'x64',

  // Electron information
  electron: getElectronVersion(),

  // Version number, with extra build numbers if in a CI environment
  version: getManifest().version,

  // The `development` option indicates whether or not the build is
  // using hot reloading and unminified content and other things like that.
  development: false,
};
