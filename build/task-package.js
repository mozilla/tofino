// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import path from 'path';
import os from 'os';

import through2 from 'through2';
import packager from 'electron-packager';
import vinyl from 'vinyl-fs';
import zip from 'gulp-vinyl-zip';

import * as BuildUtils from './utils';

const ARCH = process.arch;
const PLATFORM = os.platform();

const ROOT = path.resolve(path.join(__dirname, '..'));

// electron-packager compares these against paths that are rooted in the root
// but begin with "/", e.g. "/README.md"
const IGNORE = [
  // Ignore hidden files
  '/\\.',

  // Ignore build stuff
  '^/appveyor.yml',
  '^/branding($|/)',
  '^/build($|/)',
  '^/dist($|/)',
  '^/scripts($|/)',

  // Ignore the source code and tests
  '^/app($|/)',
  '^/test($|/)',

  // Ignore docs
  '^/docs($|/)',
  '\\.md$',
  '^/LICENSE$',
  '^/NOTICE$',
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

  const packagedApp = await packageApp({
    arch: ARCH,
    platform: PLATFORM,
    ignore: IGNORE,
    prune: true,
    version: electronVersion,
    dir: ROOT,
    icon: path.join(ROOT, 'branding', 'app-icon'),
    out: path.join(ROOT, 'dist'),
  });

  const packageName = `${manifest.name}-${appVersion}-${PLATFORM}-${ARCH}.zip`;
  const distPath = path.join(ROOT, 'dist', packageName);

  packagedApp.pipe(zip.dest(distPath));
}
