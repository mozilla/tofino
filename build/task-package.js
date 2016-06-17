// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import fs from 'fs-promise';
import path from 'path';
import os from 'os';
import packager from 'electron-packager';
import zipdir from 'zip-dir';
import { thenify } from 'thenify-all';

import * as Const from './utils/const';
import * as BuildUtils from './utils';
import { getElectronVersion, getDownloadOptions } from './utils/electron';

const ARCH = process.arch;
const PLATFORM = os.platform();

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
  packager(options, (err, packed) => {
    if (err) {
      reject(err);
    } else {
      if (packed.length !== 1) {
        reject(new Error('Expected `electron-packager` to return only one path.'));
      } else {
        resolve(packed[0]);
      }
    }
  });
});

export default async function() {
  const manifest = BuildUtils.getManifest();
  const electronVersion = getElectronVersion();
  const downloadOptions = getDownloadOptions();

  // packager displays a warning if this property is set.
  delete downloadOptions.version;

  const packagedAppPath = await packageApp({
    arch: ARCH,
    platform: PLATFORM,
    ignore: IGNORE,
    prune: true,
    version: electronVersion,
    dir: Const.ROOT,
    icon: Const.PACKAGED_ICON,
    out: Const.PACKAGED_DIST_DIR,
    download: downloadOptions,
  });

  const packageName = `${manifest.name}-${manifest.version}-${PLATFORM}-${ARCH}.zip`;
  const packagedZipPath = path.join(Const.PACKAGED_DIST_DIR, packageName);

  const buffer = await thenify(zipdir)(packagedAppPath);
  return fs.writeFile(packagedZipPath, buffer);
};
