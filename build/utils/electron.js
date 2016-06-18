// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import path from 'path';
import os from 'os';
import fs from 'fs-promise';
import * as Const from './const';
import * as BuildUtils from './';

export function getElectronExecutable() {
  return {
    win32: 'electron.exe',
    darwin: path.join('Electron.app', 'Contents', 'MacOS', 'Electron'),
    linux: 'electron',
  };
}

export function getOSElectronExecutable() {
  return getElectronExecutable()[os.platform()];
}

export function getElectronRoot() {
  return Const.ELECTRON_ROOT_DIR;
}

export function getElectronPath() {
  return path.join(getElectronRoot(), getOSElectronExecutable());
}

// This intentionally throws an exception if electron hasn't been downloaded yet.
export function getElectronVersion() {
  const versionFile = path.join(Const.ELECTRON_ROOT_DIR, 'version');
  const version = fs.readFileSync(versionFile, { encoding: 'utf8' });

  // Trim off the leading 'v'.
  return version.trim().substring(1);
}

// We cache the download in a private place since these builds may not be
// official Electron builds.
export function getDownloadOptions() {
  const manifest = BuildUtils.getManifest();
  return {
    mirror: manifest._electron.mirror,
    customDir: manifest._electron.revision,
    version: manifest._electron.version,
    cache: Const.CACHE_DIR,
    strictSSL: true,
  };
}
