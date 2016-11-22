// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import os from 'os';
import { getElectronVersion } from './electron';

export default {
  // Platform information.
  platform: os.platform(),

  // Electron information.
  electron: getElectronVersion(),

  // The `development` option indicates whether or not the build is
  // using unoptimized, unminified content and other things like that.
  development: false,

  // Whether to offer to set Tofino as the default browser.
  offerDefault: false,

  // The `packaged` flag indicates whether or not the build
  // is a distributed, standalone exexcutable or not.
  packaged: false,
};
