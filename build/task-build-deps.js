// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import path from 'path';
import fs from 'fs-promise';
import os from 'os';

import download from 'electron-download';
import unzip from 'extract-zip';
import { thenify } from 'thenify-all';

import * as BuildUtils from './utils';
import * as ElectronUtils from './utils/electron';

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

export default async function() {
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
}
