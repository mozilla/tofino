// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/**
 * Creates a `build-config.json` in the root directory for runtime access to
 * build configurations.
 */

import * as BuildUtils from './utils';
import BASE_CONFIG from './base-config';

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
