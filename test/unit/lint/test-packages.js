// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import fs from 'fs-promise';
import { autoFailingAsyncTest } from '../../utils/async';
import { REQUIRES_REGEX, IMPORTS_REGEX, globMany, regexFiles } from './shared.js';

const all = '/**/';
const valid = '*.@(js|jsx)';

const paths = [
  `app${all}${valid}`,
  `build${all}${valid}`,
  `test${all}${valid}`,
];

const native = [
  'assert',
  'child_process',
  'electron',
  'events',
  'fs',
  'os',
  'path',
  'stream',
];

const ignored = [
  // Temporary: these aren't yet referenced by the main app.
  'datascript-mori',

  // Build modules not imported anywhere, but used at the CLI.
  'electron-rebuild',
  'cross-env',

  // Test modules not imported anywhere, but used at the CLI.
  'electron-mocha',
  'mocha',
  'coveralls',
  'nyc',
  'isomorphic-fetch',

  // Webpack loaders.
  'babel-loader',
  'json-loader',
  // Needed by babel-loader
  'babel-core',

  // Modules called via CLI from main process
  'yargs',

  // Modules used only for configuration.
  'babel-plugin-transform-async-to-generator',
  'babel-plugin-transform-class-properties',
  'babel-plugin-transform-es2015-destructuring',
  'babel-plugin-transform-es2015-modules-commonjs',
  'babel-plugin-transform-es2015-parameters',
  'babel-plugin-transform-object-rest-spread',
  'babel-plugin-transform-runtime',
  'babel-preset-react-optimize',
  'babel-preset-react',
  'babel-runtime',
  'babel-eslint',
  'uglify-js',
  'eslint',
  'eslint-config-airbnb',
  'eslint-plugin-import',
  'eslint-plugin-jsx-a11y',
  'eslint-plugin-react',
  'react-addons-test-utils',
];

describe('packages', () => {
  it('should not be orphaned', autoFailingAsyncTest(async function() {
    const manifest = await fs.readJson('package.json');
    const modules = [
      ...native,
      ...Object.keys(manifest.dependencies),
      ...Object.keys(manifest.devDependencies),
    ];

    const sources = await globMany(paths);
    const matches = await regexFiles(sources, REQUIRES_REGEX, IMPORTS_REGEX);
    const expected = Array.from(new Set([...matches, ...ignored]));

    expect(expected.sort()).toEqual(modules.sort());
  }));
});
