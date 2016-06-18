// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import rimraf from 'rimraf';
import * as Const from './utils/const';

export default () => new Promise((resolve, reject) => {
  rimraf(Const.PACKAGED_DIST_DIR, err => {
    if (err) {
      reject(err);
    }
    resolve();
  });
});
