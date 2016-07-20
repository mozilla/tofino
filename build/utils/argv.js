// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import yargs from 'yargs';

export default yargs
  .usage('Usage: $0 [options]')
  .option('i', {
    alias: 'build-deps',
    describe: 'Install all dependencies.',
    type: 'boolean',
  })
  .option('b', {
    alias: 'build',
    describe: 'Build the app.',
    type: 'boolean',
  })
  .option('s', {
    alias: 'serve',
    describe: 'Start the app services standalone.',
    type: 'boolean',
  })
  .option('r', {
    alias: 'run',
    describe: 'Build and start the app.',
    type: 'boolean',
  })
  .option('d', {
    alias: 'run-dev',
    describe: 'Build and start the app in development mode.',
    type: 'boolean',
  })
  .option('p', {
    alias: 'package',
    describe: 'Package the app.',
    type: 'boolean',
  })
  .option('t', {
    alias: 'test',
    describe: 'Run tests.',
    type: 'boolean',
  })
  .option('T', {
    alias: 'test-ci',
    describe: 'Run tests on both production and development builds.',
    type: 'boolean',
  })
  .argv;
