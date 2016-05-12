// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/* eslint no-console: 0 */

import path from 'path';
import fs from 'fs-promise';
import os from 'os';

import download from 'electron-download';
import unzip from 'extract-zip';
import thenify from 'thenify';

import * as BuildUtils from './utils';

async function downloadElectron() {
  const tmpDir = path.join(os.tmpdir(), 'tofino-tmp');
  await fs.mkdirs(tmpDir);

  try {
    const zipPath = await thenify(download)(BuildUtils.getDownloadOptions());

    await thenify(unzip)(zipPath, { dir: tmpDir });

    // Some tools like electron-rebuild rely on this to find the executable
    await fs.writeFile(path.join(tmpDir, 'path.txt'),
                       BuildUtils.getElectronExecutable()[os.platform()]);

    const targetDir = BuildUtils.getElectronRoot();
    await fs.remove(targetDir);
    await fs.move(tmpDir, targetDir);
  } finally {
    if (await fs.exists(tmpDir)) {
      fs.remove(tmpDir);
    }
  }
}

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
  await BuildUtils.spawn(command, [
    '-f',
    '-e', BuildUtils.getElectronRoot(),
    '-v', BuildUtils.getElectronVersion(),
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

  const electron = BuildUtils.getManifest()._electron;
  let currentElectron = null;
  try {
    currentElectron = BuildUtils.getElectronVersion();
  } catch (e) {
    // Fall through and download
  }

  if (electron.version !== currentElectron) {
    await downloadElectron();
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
    BuildUtils.writeBuildConfig(existingConfig);
  }
}
