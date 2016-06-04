// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import path from 'path';
import fs from 'fs';
import * as Const from '../../../build/const.js';

const cwd = fs.realpathSync(process.cwd());

describe('build constants', () => {
  it('should export `PACKAGED_DIST_DIR`', () => {
    expect(Const.PACKAGED_DIST_DIR).toEqual(path.join(cwd, 'dist'));
  });
});
