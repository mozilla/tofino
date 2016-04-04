'use strict';

const path = require('path');
const os = require('os');

const through2 = require('through2');
const packager = require('electron-packager');
const vinyl = require('vinyl-fs');
const zip = require('gulp-vinyl-zip');

const buildUtils = require('./utils');
const manifest = require('../package.json');
const electronConfig = require('./electron-config');

const arch = 'x64';
const platform = os.platform();
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

function packageApp(options) {
  let rs = through2.obj();

  packager(options, (err, packed) => {
    if (err) {
      rs.emit('error', err);
      rs.end();
      return;
    }

    let globs = packed.map(d => d + '/**');
    vinyl.src(globs, { followSymlinks: false, ignore: packed, dot: true }).pipe(rs);
  });

  return rs;
}

module.exports = () => {
  let packageName = `${manifest.name}-${buildUtils.getAppVersion()}-${platform}-${arch}.zip`;
  let devDependencies = Object.keys(manifest.devDependencies).map(dep => '/node_modules/' + dep + '($|/)');
  let ignore = IGNORE.concat(devDependencies);

  return packageApp({
    arch,
    platform,
    ignore: ignore,
    version: electronConfig.version,
    dir: path.join(__dirname, '..'),
    icon: path.join(__dirname, '..', 'branding', 'app-icon'),
    out: path.join(__dirname, '..', 'dist'),
  }).pipe(zip.dest(path.join(__dirname, '..', 'dist', packageName)));
};
