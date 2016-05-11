// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import path from 'path';
import * as Const from '../../build/const.js';

describe('build constants', () => {
  it('should export `DIST_DIR`', () => {
    expect(Const.DIST_DIR).toEqual(path.join(process.cwd(), 'dist'));
  });
});
