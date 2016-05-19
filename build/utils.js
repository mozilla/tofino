// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import os from 'os';
import path from 'path';
import fs from 'fs-promise';
import childProcess from 'child_process';

import manifest from '../package.json';

export const IS_TRAVIS = process.env.TRAVIS === 'true';
export const IS_APPVEYOR = process.env.APPVEYOR === 'True';

export function getElectronExecutable() {
  return {
    win32: 'electron.exe',
    darwin: path.join('Electron.app', 'Contents', 'MacOS', 'Electron'),
    linux: 'electron',
  };
}

// We cache the download in a private place since these builds may not be
// official Electron builds.
export function getDownloadOptions() {
  return {
    version: manifest._electron.version,
    cache: path.join(__dirname, '..', '.cache'),
    strictSSL: true,
  };
}

export const getAppVersion = () => manifest.version;

export function getRoot() {
  return path.dirname(__dirname);
}

export function getBuildConfig() {
  const file = path.join(__dirname, '..', 'build-config.json');
  return fs.readJsonSync(file);
}

export function writeBuildConfig(obj) {
  const file = path.join(__dirname, '..', 'build-config.json');
  return fs.writeJsonSync(file, obj, { spaces: 2 });
}

export function getManifest() {
  return manifest;
}

export function getElectronRoot() {
  return path.join(__dirname, '..', '.electron');
}

export function getElectronPath() {
  return path.join(getElectronRoot(), getElectronExecutable()[os.platform()]);
}

// This intentionally throws an exception if electron hasn't been downloaded yet.
export function getElectronVersion() {
  const versionFile = path.join(getElectronRoot(), 'version');
  const version = fs.readFileSync(versionFile, { encoding: 'utf8' });

  // Trim off the leading 'v'.
  return version.trim().substring(1);
}

export async function spawn(command, args, options = {}) {
  if (os.type() === 'Windows_NT') {
    try {
      // Prefer a cmd version if available
      const testCommand = `${command}.cmd`;
      const stats = await fs.stat(testCommand);
      if (stats.isFile()) {
        command = testCommand;
      }
    } catch (e) {
      // Ignore missing files.
    }
  }

  return new Promise((resolve, reject) => {
    const child = childProcess.spawn(command, args, options);

    child.on('error', reject);
    child.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Child process ${command} exited with exit code ${code}`));
      } else {
        resolve();
      }
    });
  });
}
