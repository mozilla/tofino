// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/**
 * Creates a `build-config.json` in the root directory for runtime access to
 * build configurations.
 */

import pick from 'lodash/pick';
import { getBuildConfig, writeBuildConfig } from './utils';
import baseConfig from './utils/base-config';

export function overwriteConfig(customConfig) {
  let currentConfig = {};

  try {
    currentConfig = getBuildConfig();
  } catch (e) {
    // Ignore missing file errors.
  }

  writeBuildConfig({
    ...currentConfig,
    ...baseConfig,
    ...customConfig,
  });
}

export function saveConfigAsPrev() {
  const currentConfig = getBuildConfig();
  const sanitizedConfig = pick(currentConfig, Object.keys(baseConfig));

  writeBuildConfig({
    ...currentConfig,
    prev: sanitizedConfig,
  });
}
