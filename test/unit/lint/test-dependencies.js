// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import fs from 'fs-promise';
import without from 'lodash/without';
import path from 'path';
import { REQUIRES_REGEX, IMPORTS_REGEX, globMany, regexFiles } from './shared';

const all = '/**/';
const valid = '*.@(js|jsx)';

// Node and electron native modules
const native = [
  'assert',
  'child_process',
  'electron',
  'events',
  'fs',
  'os',
  'path',
  'stream',
  'url',
];

describe('dependencies', () => {
  it('– processes only use app dependencies or main dependencies', async function() {
    const paths = [
      `app/main${all}${valid}`,
      `app/services${all}${valid}`,
      `app/shared${all}${valid}`,
      `app/ui${all}${valid}`,
    ];

    const temporary = [
      // These aren't yet referenced by the main app.
      'datascript-mori',
    ];

    const appManifest = await fs.readJson(path.join('app', 'package.json'));
    const mainManifest = await fs.readJson(path.join('package.json'));

    const appPackages = Object.keys(appManifest.dependencies);
    const mainPackages = Object.keys(mainManifest.dependencies);
    const packages = without([...appPackages, ...mainPackages], ...temporary).sort();

    const sources = await globMany(paths);
    const matches = await regexFiles(sources, REQUIRES_REGEX, IMPORTS_REGEX);
    const usedPackages = without(matches, ...native).sort();

    expect(usedPackages).toEqual(packages);
  });

  it('– build and test code only use main dependencies or devDependencies', async function() {
    const paths = [
      `build${all}${valid}`,
      `test${all}${valid}`,
    ];

    const temporary = [
      // These aren't yet referenced by the main app.
    ];

    const ignored = [
      // Modules not imported anywhere, but used at the CLI.
      'cross-env',

      // Test modules not imported anywhere, but used at the CLI.
      'mocha',
      'electron-mocha',
      'coveralls',
      'nyc',

      // Required dynamically in mocha.opts
      'isomorphic-fetch',

      // Webpack loaders.
      'babel-loader',
      'json-loader',

      // Needed by babel-loader.
      'babel-core',
      'babel-runtime',

      // Modules used only for configuration.
      'babel-eslint',
      'babel-plugin-transform-async-to-generator',
      'babel-plugin-transform-class-properties',
      'babel-plugin-transform-es2015-destructuring',
      'babel-plugin-transform-es2015-modules-commonjs',
      'babel-plugin-transform-es2015-parameters',
      'babel-plugin-transform-object-rest-spread',
      'babel-plugin-transform-runtime',
      'babel-preset-react-optimize',
      'babel-preset-react',
      'eslint-config-airbnb',
      'eslint-plugin-babel',
      'eslint-plugin-import',
      'eslint-plugin-jsx-a11y',
      'eslint-plugin-react',
      'react-addons-test-utils',
      'uglify-js',
    ];

    const mainManifest = await fs.readJson('package.json');
    const mainPackages = Object.keys(mainManifest.dependencies);
    const mainDevPackages = Object.keys(mainManifest.devDependencies);

    const packages = without(mainDevPackages, ...temporary, ...ignored).sort();

    const sources = await globMany(paths);
    const matches = await regexFiles(sources, REQUIRES_REGEX, IMPORTS_REGEX);

    // Strip out the main dependencies should leave only the devDependencies.
    const usedPackages = without(matches, ...native, ...mainPackages).sort();
    expect(usedPackages).toEqual(packages);
  });
});
