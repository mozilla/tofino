// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

'use strict';

require('babel-polyfill');
require('babel-register')();

if (~process.argv.indexOf('--run')) {
  require('./tasks').run();
} else if (~process.argv.indexOf('--run-dev')) {
  require('./tasks').runDev();
} else if (~process.argv.indexOf('--package')) {
  require('./tasks').package();
}
