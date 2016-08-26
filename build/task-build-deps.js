// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import path from 'path';
import fs from 'fs-promise';
import os from 'os';

import download from 'electron-download';
import unzip from 'extract-zip';
import { thenify } from 'thenify-all';

import * as BuildUtils from './utils';
import * as ProcessUtils from './utils/process';
import * as ElectronUtils from './utils/electron';
import * as Const from './utils/const';
import { logger } from './logging';

async function downloadElectron() {
  const tmpDir = path.join(os.tmpdir(), 'tofino-tmp');
  await fs.mkdirs(tmpDir);

  try {
    const zipPath = await thenify(download)(ElectronUtils.getDownloadOptions());
    await thenify(unzip)(zipPath, { dir: tmpDir });

    // Some tools like electron-rebuild rely on this to find the executable
    await fs.writeFile(path.join(tmpDir, 'path.txt'), ElectronUtils.getOSElectronExecutable());

    const targetDir = ElectronUtils.getElectronRoot();
    await fs.remove(targetDir);
    await fs.move(tmpDir, targetDir);
  } finally {
    if (await fs.exists(tmpDir)) {
      fs.remove(tmpDir);
    }
  }
}

async function findNativeModules() {
  const files = await fs.walk(Const.NODE_MODULES_DIR);
  const modules = {};

  for (const { path: filepath, stats } of files) {
    if (!stats.isFile()) {
      continue;
    }

    // Native modules have `binding.gyp` at the top level.
    if (path.basename(filepath) !== 'binding.gyp') {
      continue;
    }

    // Check it is at the top level.
    const modulePath = path.dirname(filepath);
    if (path.basename(path.dirname(modulePath)) !== 'node_modules') {
      continue;
    }

    // Check the module manifest and store the version.
    try {
      const moduleManifest = await fs.readJson(path.join(modulePath, 'package.json'));
      modules[path.relative(Const.NODE_MODULES_DIR, modulePath)] = moduleManifest.version;
    } catch (e) {
      // Ignore bad modules
    }
  }

  return modules;
}

async function rebuild() {
  logger.info('Rebuilding modules...');
  const command = path.join(Const.NODE_MODULES_DIR, '.bin', 'electron-rebuild');
  await ProcessUtils.spawn(command, [
    '-f',
    '-e', ElectronUtils.getElectronRoot(),
    '-v', ElectronUtils.getElectronVersion(),
  ], {
    stdio: 'inherit',
  });
}

export default async function() {
  let existingConfig = {};
  try {
    existingConfig = BuildUtils.getBuildConfig();
  } catch (e) {
    // Missing files mean we rebuild
  }

  let currentElectron = null;
  try {
    currentElectron = ElectronUtils.getElectronVersion();
  } catch (e) {
    // Fall through and download
  }

  const electron = BuildUtils.getManifest()._electron;
  if (electron.version !== currentElectron) {
    await downloadElectron();
  }

  const modules = await findNativeModules();
  if (Object.keys(modules).length === 0) {
    return;
  }

  const shouldRebuild = () => {
    if (existingConfig.electron !== ElectronUtils.getElectronVersion()) {
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
    existingConfig.electron = ElectronUtils.getElectronVersion();
    existingConfig.nativeModules = modules;
    BuildUtils.writeBuildConfig(existingConfig);
  }
}
