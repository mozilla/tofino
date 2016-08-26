// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import fs from 'fs-promise';
import without from 'lodash/without';
import { REQUIRES_REGEX, IMPORTS_REGEX, globMany, regexFiles } from './shared';

const all = '/**/';
const valid = '*.@(js|jsx)';

const paths = [
  `app/main${all}${valid}`,
  `app/services${all}${valid}`,
  `app/shared${all}${valid}`,
];

const ignored = [
  'electron-ipc-mock',
  'react-addons-perf',
];

describe('dev dependecies', () => {
  it('should not be imported in non-browser processes', async function() {
    const manifest = await fs.readJson('package.json');
    const modules = Object.keys(manifest.devDependencies);

    const sources = await globMany(paths);
    const matches = await regexFiles(sources, REQUIRES_REGEX, IMPORTS_REGEX);
    const expected = Array.from(new Set(without(matches, ...ignored)));

    for (const module of modules) {
      expect(expected).toExclude(module);
    }
  });
});
