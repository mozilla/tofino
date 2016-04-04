
require('babel-register')();

const gulp = require('gulp');
const buildConfig = require('./build/config-builder').buildConfig;

gulp.task('download-electron',
  require('./build/download-electron'));

gulp.task('build', ['download-electron'], function(cb) {
  buildConfig({ development: false });
  return require('./build/build')(cb);
});

gulp.task('build-dev', ['download-electron'], function(cb) {
  buildConfig({ development: true });
  return require('./build/build')(cb);
});

gulp.task('clean-package',
  require('./build/clean-package'));

gulp.task('package', ['download-electron', 'clean-package', 'build'], function (cb) {
  buildConfig({ development: false, packaged: true });
  return require('./build/package')(cb);
});

gulp.task('run-dev',
  ['download-electron', 'build-dev'],
  require('./build/run')('development'));

gulp.task('run',
  ['download-electron', 'build'],
  require('./build/run')('production'));
