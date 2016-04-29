// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/**
 * Disable the eslint "strict" and "no-commonjs" rules, since this is a script
 * that runs in node without any babel support, so it's not not a module
 * implicitly running in strict mode, and we can't use the import syntax.
 */
/* eslint-disable strict */
/* eslint-disable import/no-commonjs */
/* eslint-disable no-console */

'use strict';

require('babel-polyfill');
require('babel-register')();

require('check-dependencies')((result) => {
  if (!result.depsWereOk) {
    console.error('Dependency checks failed.');
    result.error.forEach(err => console.error(err));
    process.exit(1);
  }

  const handleTaskFailed = e => {
    console.error('Build failed.');
    console.error(e);
    process.exit(1);
  };

  const Tasks = require('./tasks').default;

  if (~process.argv.indexOf('--build')) {
    const taskArgs = process.argv.slice(1 + process.argv.indexOf('--build'));
    Tasks.build({}, taskArgs).then(null, handleTaskFailed);
  } else if (~process.argv.indexOf('--run')) {
    const taskArgs = process.argv.slice(1 + process.argv.indexOf('--run'));
    Tasks.run(taskArgs).then(null, handleTaskFailed);
  } else if (~process.argv.indexOf('--run-dev')) {
    const taskArgs = process.argv.slice(1 + process.argv.indexOf('--run-dev'));
    Tasks.runDev(taskArgs).then(null, handleTaskFailed);
  } else if (~process.argv.indexOf('--package')) {
    Tasks.package().then(null, handleTaskFailed);
  } else if (~process.argv.indexOf('--test')) {
    const taskArgs = process.argv.slice(1 + process.argv.indexOf('--test'));
    Tasks.test(taskArgs).then(null, handleTaskFailed);
  } else if (~process.argv.indexOf('--quicktest')) {
    const taskArgs = process.argv.slice(1 + process.argv.indexOf('--quicktest'));
    Tasks.quickTest(taskArgs).then(null, handleTaskFailed);
  } else if (~process.argv.indexOf('--build-deps')) {
    Tasks.buildDeps().then(null, handleTaskFailed);
  }
});
