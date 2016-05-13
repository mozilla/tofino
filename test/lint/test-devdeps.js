// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import fs from 'fs-promise';
import without from 'lodash/without';
import {
  REQUIRES_REGEX,
  IMPORTS_REGEX,
  autoFailingAsyncTest,
  globMany,
  regexFiles,
} from './shared.js';

const all = '/**/';
const valid = '*.@(js|jsx)';

const paths = [
  `app${all}${valid}`,
];

// XXX: Which of these do we actually need to ignore?
const ignored = [
  'electron-ipc-mock',

  // XXX: I'm not sure about these ones...
  'express',
  'react-addons-perf',
  'source-map-support',
  'uuid',
];

describe('packages', () => {
  it('should not import dev dependencies in app/', autoFailingAsyncTest(async function() {
    const manifest = await fs.readJson('package.json');
    const modules = Object.keys(manifest.devDependencies);

    const sources = await globMany(paths);
    const matches = await regexFiles(sources, REQUIRES_REGEX, IMPORTS_REGEX);
    const expected = Array.from(new Set(without(matches, ...ignored)));

    for (const module of modules) {
      expect(expected).toExclude(module);
    }
  }));
});
