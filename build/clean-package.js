// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

'use strict';

const path = require('path');
const rimraf = require('rimraf');

module.exports = () => new Promise(resolve => {
  rimraf(path.join(__dirname, '..', 'dist'), resolve);
});
