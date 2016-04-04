'use strict';

const path = require('path');

const rimraf = require('rimraf');

module.exports = cb => {
  rimraf(path.join(__dirname, '..', 'dist'), cb);
};
