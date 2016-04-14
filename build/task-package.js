// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import path from 'path';
import os from 'os';

import through2 from 'through2';
import packager from 'electron-packager';
import vinyl from 'vinyl-fs';
import zip from 'gulp-vinyl-zip';

import * as BuildUtils from './utils';

const ARCH = 'x64';
const PLATFORM = os.platform();

const IGNORE = [
  // Ignore build stuff
  '/appveyor.yml',
  '/branding($|/)',
  '/build($|/)',
  '/dist($|/)',
  '/electron($|/)',
  '/gulpfile.js',
  '/README.md',
  '/scripts($|/)',
  '/test($|/)',

  // Ignore source code
  '/ui($|/)',

  // Ignore `/app` and `/shared` once we compile main process code
  // ahead of time, rather than during runtime
  // '/app($|/)',
  // '/shared($|/)',
];

const packageApp = options => new Promise((resolve, reject) => {
  const rs = through2.obj();

  packager(options, (err, packed) => {
    if (err) {
      rs.emit('error', err);
      rs.end();
      reject(err);
      return;
    }

    const globs = packed.map(d => `${d}/**`);
    vinyl.src(globs, {
      followSymlinks: false,
      ignore: packed,
      dot: true,
    }).pipe(rs);
  });

  resolve(rs);
});

export default async function() {
  const manifest = BuildUtils.getManifest();
  const electronVersion = BuildUtils.getElectronVersion();
  const appVersion = BuildUtils.getAppVersion();

  const devDeps = Object.keys(manifest.devDependencies).map(dep => `/node_modules/${dep}($|/)`);
  const pathsToIgnore = IGNORE.concat(devDeps);

  const packagedApp = await packageApp({
    arch: ARCH,
    platform: PLATFORM,
    ignore: pathsToIgnore,
    version: electronVersion,
    dir: path.join(__dirname, '..'),
    icon: path.join(__dirname, '..', 'branding', 'app-icon'),
    out: path.join(__dirname, '..', 'dist'),
  });

  const packageName = `${manifest.name}-${appVersion}-${PLATFORM}-${ARCH}.zip`;
  const distPath = path.join(__dirname, '..', 'dist', packageName);

  packagedApp.pipe(zip.dest(distPath));
}
