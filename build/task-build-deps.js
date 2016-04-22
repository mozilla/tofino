// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/* eslint no-console: 0 */

import path from 'path';
import fs from 'fs-promise';

import { BUILD_CONFIG_JSON } from './task-config-builder';
import * as BuildUtils from './utils';

async function findNativeModules() {
  const nodeModules = path.join(__dirname, '..', 'node_modules');
  const files = await fs.walk(nodeModules);

  const modules = {};
  for (const { path: filepath, stats } of files) {
    if (!stats.isFile()) {
      continue;
    }

    // Native modules have `binding.gyp` at the top level.
    if (path.basename(filepath) === 'binding.gyp') {
      const modulePath = path.dirname(filepath);

      // Check it is at the top level.
      if (path.basename(path.dirname(modulePath)) !== 'node_modules') {
        continue;
      }

      try {
        const moduleManifest = await fs.readJson(path.join(modulePath, 'package.json'));
        modules[path.relative(nodeModules, modulePath)] = moduleManifest.version;
      } catch (e) {
        // Ignore bad modules
      }
    }
  }

  return modules;
}

async function rebuild() {
  console.log('Rebuilding modules...');
  const command = path.join(__dirname, '..', 'node_modules', '.bin', 'electron-rebuild');
  await BuildUtils.spawn(command, ['-f'], {
    stdio: 'inherit',
  });
}

export default async function() {
  let existingConfig = {};
  try {
    existingConfig = await fs.readJson(BUILD_CONFIG_JSON);
  } catch (e) {
    // Missing files mean we rebuild
  }

  const modules = await findNativeModules();
  if (Object.keys(modules).length === 0) {
    return;
  }

  const shouldRebuild = () => {
    if (existingConfig.electron !== BuildUtils.getElectronVersion()) {
      return true;
    }

    if (!('nativeModules' in existingConfig)) {
      return true;
    }

    for (const modulePath of Object.keys(modules)) {
      if (!(modulePath in existingConfig.nativeModules)) {
        return true;
      }

      if (modules[modulePath] !== existingConfig.nativeModules[modulePath]) {
        return true;
      }
    }

    return false;
  };

  if (shouldRebuild()) {
    await rebuild();
    existingConfig.electron = BuildUtils.getElectronVersion();
    existingConfig.nativeModules = modules;
    await fs.writeJson(BUILD_CONFIG_JSON, existingConfig, { spaces: 2 });
  }
}
