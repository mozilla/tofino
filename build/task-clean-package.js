// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import path from 'path';
import rimraf from 'rimraf';

export default () => new Promise((resolve, reject) => {
  rimraf(path.join(__dirname, '..', 'dist'), err => {
    if (err) {
      reject(err);
    }
    resolve();
  });
});
