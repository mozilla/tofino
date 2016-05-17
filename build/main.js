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

const checkDependencies = require('check-dependencies');

const handleDepsCheckFailed = result => {
  console.error('Dependency checks failed.');
  result.error.forEach(err => console.error(err));
  process.exit(1);
};

const handleTaskFailed = err => {
  console.error('Build failed.');
  console.error(err);
  process.exit(1);
};

const handleDepsCheckSucceeded = () => {
  const argv = process.argv;
  const tasks = require('./tasks').default;
  const handlers = {
    '--build': args => tasks.build({}, args),
    '--run': args => tasks.run(args),
    '--run-dev': args => tasks.runDev(args),
    '--package': () => tasks.package(),
    '--test': args => tasks.test(args),
    '--quicktest': args => tasks.quickTest(args),
    '--lint': args => tasks.lintOnlyTest(args),
    '--build-deps': () => tasks.buildDeps(),
  };
  main(argv, tasks, handlers, handleTaskFailed);
};

function main(argv, tasks, handlers, catcher) {
  const outstanding = [];

  for (const handler of Object.entries(handlers)) {
    const command = handler[0];
    const runner = handler[1];
    if (~argv.indexOf(command)) {
      const args = argv.slice(1 + argv.indexOf(command));
      outstanding.push(runner(args));
    }
  }

  return Promise.all(outstanding).then(null, catcher);
}

// This is a script that runs in node without any babel support.
module.exports = main;

// Only auto-run `checkDependencies` if this is *not* imported as a module.
// If `require.main` is `module`, then this is ran as a script.
if (require.main === module) {
  checkDependencies(result => {
    if (!result.depsWereOk) {
      handleDepsCheckFailed(result);
    } else {
      handleDepsCheckSucceeded();
    }
  });
}
