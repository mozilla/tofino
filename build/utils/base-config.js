// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import { getElectronVersion } from './electron';

export default {
  // Electron information
  electron: getElectronVersion(),

  // The `development` option indicates whether or not the build is
  // using unoptimized, unminified content and other things like that.
  development: false,
};
