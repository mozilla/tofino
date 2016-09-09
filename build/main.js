// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/**
 * Disable the eslint "strict" and "no-commonjs" rules, since this is a script
 * that runs in node without any babel support, so it's not not a module
 * implicitly running in strict mode, and we can't use the import syntax.
 */
/* eslint-disable strict */
/* eslint-disable import/no-commonjs */

'use strict';

require('babel-polyfill');
require('babel-register')();

const Tasks = require('./tasks');
const Runtime = require('./utils/runtime');
const { logger } = require('./logging');

const handleTaskFailed = err => {
  logger.error('Build failed.');
  logger.error(err);
  process.exit(1);
};

const handleDepsCheckFailed = result => {
  logger.error('Dependency checks failed.');
  result.error.forEach(err => logger.error(err));
  process.exit(1);
};

const handleDepsCheckSucceeded = () => {
  Tasks.run().then(null, handleTaskFailed);
};

// Only auto-run `checkDependencies` if this is *not* imported as a module.
// If `require.main` is `module`, then this is ran as a script.
if (require.main === module) {
  Runtime.checkNodeVersion(process.version);
  Runtime.checkDependencies().then(handleDepsCheckSucceeded, handleDepsCheckFailed);
}
