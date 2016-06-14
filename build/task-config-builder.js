// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/**
 * Creates a `build-config.json` in the root directory for runtime access to
 * build configurations.
 */

import pick from 'lodash/pick';
import * as BuildUtils from './utils';
import BASE_CONFIG from './base-config';

export function overwriteConfig(customConfig) {
  let currentConfig = {};

  try {
    currentConfig = BuildUtils.getBuildConfig();
  } catch (e) {
    // Ignore missing file errors.
  }

  BuildUtils.writeBuildConfig({
    ...currentConfig,
    ...BASE_CONFIG,
    ...customConfig,
  });
}

export function saveConfigAsPrev() {
  const currentConfig = BuildUtils.getBuildConfig();
  const sanitizedConfig = pick(currentConfig, Object.keys(BASE_CONFIG));

  BuildUtils.writeBuildConfig({
    ...currentConfig,
    prev: sanitizedConfig,
  });
}
