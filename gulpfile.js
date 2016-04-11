
require('babel-register')();

const gulp = require('gulp');
const buildConfig = require('./build/config-builder').buildConfig;

gulp.task('build', (cb) => {
  buildConfig({ development: false });
  return require('./build/build')(cb);
});

gulp.task('build-dev', (cb) => {
  buildConfig({ development: true });
  return require('./build/build')(cb);
});

gulp.task('clean-package',
  require('./build/clean-package'));

gulp.task('package', ['clean-package', 'build'], (cb) => {
  buildConfig({ development: false, packaged: true });
  return require('./build/package')(cb);
});

gulp.task('run-dev',
  ['build-dev'],
  require('./build/run')('development'));

gulp.task('run',
  ['build'],
  require('./build/run')('production'));
