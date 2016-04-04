// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

'use strict';

const path = require('path');
const os = require('os');

const through2 = require('through2');
const electronDownloader = require('electron-download');
const vinyl = require('vinyl-fs');
const vinylFile = require('vinyl-file');
const zip = require('gulp-vinyl-zip');

const electronConfig = require('./electron-config');
const arch = 'x64';
const platform = os.platform();

process.env.ELECTRON_MIRROR = electronConfig.mirror;

function path2vinyl() {
  return through2.obj((path, encoding, callback) => {
    vinylFile.read(path).then(file => callback(null, file), callback);
  });
}

function electron(options) {
  let rs = path2vinyl();

  electronDownloader(options, (err, zipFile) => {
    if (err) {
      rs.emit('error', err);
      rs.end();
      return;
    }

    rs.write(zipFile);
    rs.end();
  });

  return rs;
}

module.exports = () => {
  return electron({
    version: electronConfig.version,
    arch,
    platform,
  })
  .pipe(zip.src())
  .pipe(vinyl.dest(path.join(__dirname, '..', 'electron')));
};
