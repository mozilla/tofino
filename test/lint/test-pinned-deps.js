// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import fs from 'fs-promise';
import { autoFailingAsyncTest } from '../utils/async';

describe('dependecies', () => {
  it('should be pinned', autoFailingAsyncTest(async function() {
    const manifest = await fs.readJson('package.json');
    const modules = [
      ...Object.values(manifest.dependencies),
      ...Object.values(manifest.devDependencies),
    ];

    for (const module of modules) {
      expect(module).toNotMatch(/^\^/);
    }
  }));
});
