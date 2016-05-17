// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import fs from 'fs-promise';
import difference from 'lodash/difference';
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
  `build${all}${valid}`,
  `test${all}${valid}`,
];

const ignored = [
  // Build modules not imported anywhere, but used at the CLI.
  'electron-rebuild',

  // Test modules not imported anywhere, but used at the CLI.
  'mocha',
  'coveralls',
  'nyc',

  // Modules used only for configuration.
  'babel-preset-es2015-node5',
  'babel-preset-react',
  'babel-preset-stage-2',
  'babel-eslint',
  'eslint',
  'eslint-config-airbnb',
  'eslint-plugin-flow-vars',
  'eslint-plugin-import',
  'eslint-plugin-react',
];

describe('packages', () => {
  it('should not be orphaned', autoFailingAsyncTest(async function() {
    const manifest = await fs.readJson('package.json');
    const modules = [
      ...Object.keys(manifest.dependencies),
      ...Object.keys(manifest.devDependencies),
    ];

    const sources = await globMany(paths);
    const matches = await regexFiles(sources, REQUIRES_REGEX, IMPORTS_REGEX);
    const expected = Array.from(new Set([...matches, ...ignored]));

    expect(difference(modules, expected)).toEqual([]);
  }));
});
