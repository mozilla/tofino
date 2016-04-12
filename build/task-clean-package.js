// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

'use strict';

const path = require('path');
const rimraf = require('rimraf');

module.exports = () => new Promise((resolve, reject) => {
  rimraf(path.join(__dirname, '..', 'dist'), err => {
    if (err) {
      reject(err);
    }
    resolve();
  });
});
