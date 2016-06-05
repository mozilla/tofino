// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import rimraf from 'rimraf';
import * as BuildConst from './const.js';

export default () => new Promise((resolve, reject) => {
  rimraf(BuildConst.PACKAGED_DIST_DIR, err => {
    if (err) {
      reject(err);
    }
    resolve();
  });
});
