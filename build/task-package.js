// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import fs from 'fs-promise';
import path from 'path';
import os from 'os';
import builder from 'electron-builder';
import zipdir from 'zip-dir';
import { thenify } from 'thenify-all';
import { getAppManifest } from './utils';

import * as Const from './utils/const';
import { getElectronVersion, getDownloadOptions } from './utils/electron';
import { logger } from './logging';

const ARCH = process.arch;
const PLATFORM = os.platform();

const archIfNotx64 = ARCH === 'x64' ? '' : `-${ARCH}`;

const EXENAME = getAppManifest().productName;
const APPNAME = getAppManifest().name;
const VERSION = getAppManifest().version;

const PACKAGENAME = `tofino-${PLATFORM}-${ARCH}`;

// electron-builder outputs its targets using different naming schemes depending
// on architecture and platform. We want them to be fairly consistent so this
// is a set of instructions to copy/zip files into the targets we want.
const fileChanges = {
  win32: {
    copies: [
      [path.join(Const.PACKAGED_DIST_DIR, `win${archIfNotx64}`,
                 `${EXENAME} Setup ${VERSION}${archIfNotx64}.exe`),
       path.join(Const.PACKAGED_DIST_DIR, `${PACKAGENAME}.exe`)],

      [path.join(Const.PACKAGED_DIST_DIR, `win${archIfNotx64}`,
                 `${APPNAME}-${VERSION}-full.nupkg`),
       path.join(Const.PACKAGED_DIST_DIR, `${APPNAME}-${VERSION}-full.nupkg`)],

      [path.join(Const.PACKAGED_DIST_DIR, `win${archIfNotx64}`, 'RELEASES'),
       path.join(Const.PACKAGED_DIST_DIR, 'RELEASES')],
    ],
    zips: [
      [path.join(Const.PACKAGED_DIST_DIR, `win${archIfNotx64}-unpacked`),
       path.join(Const.PACKAGED_DIST_DIR, `${PACKAGENAME}.zip`)],
    ],
  },
  darwin: {
    copies: [
      [path.join(Const.PACKAGED_DIST_DIR, 'mac', `${EXENAME}-${VERSION}-mac.zip`),
       path.join(Const.PACKAGED_DIST_DIR, `${PACKAGENAME}.zip`)],

      [path.join(Const.PACKAGED_DIST_DIR, 'mac',  `${EXENAME}-${VERSION}.dmg`),
       path.join(Const.PACKAGED_DIST_DIR, `${PACKAGENAME}.dmg`)],
    ],
  },
  linux: {
    moves: [
      [path.join(Const.PACKAGED_DIST_DIR, `${APPNAME}-${VERSION}.tar.bz2`),
       path.join(Const.PACKAGED_DIST_DIR, `${PACKAGENAME}.tar.bz2`)],
    ],
  },
};

export default async function() {
  const electronVersion = getElectronVersion();
  const downloadOptions = getDownloadOptions();

  // packager displays a warning if this property is set.
  delete downloadOptions.version;

  await builder.build({
    devMetadata: {
      directories: {
        app: Const.LIB_DIR,
        output: Const.PACKAGED_DIST_DIR,
      },
      build: {
        appId: 'tofino',
        category: 'web',
        asar: false,
        electronVersion,
        download: downloadOptions,
        npmRebuild: false,
        linux: {
          target: ['tar.bz2'],
        },
        mac: {
          icon: path.join(Const.ROOT, 'branding', 'app-icon.icns'),
          target: ['default'],
        },
        dmg: {
          icon: path.join(Const.ROOT, 'branding', 'app-icon.icns'),
          contents: [
            {
              x: 410,
              y: 150,
              type: 'link',
              path: '/Applications',
            },
            {
              x: 130,
              y: 150,
              type: 'file',
            },
          ],
        },
        win: {
          icon: path.join(Const.ROOT, 'branding', 'app-icon.ico'),
          iconURL: 'https://raw.githubusercontent.com/mozilla/tofino/master/branding/app-icon.ico',
          target: ['default'],
        },
      },
    },
  });

  const mutations = fileChanges[PLATFORM];

  if ('copies' in mutations) {
    for (const [from, to] of mutations.copies) {
      await fs.copy(from, to);
    }
  }

  if ('moves' in mutations) {
    for (const [from, to] of mutations.moves) {
      await fs.rename(from, to);
    }
  }

  if ('zips' in mutations) {
    for (const [dir, target] of mutations.zips) {
      logger.info(`Zipping ${dir} to ${target}`);
      const buffer = await thenify(zipdir)(dir);
      await fs.writeFile(target, buffer);
    }
  }
};
