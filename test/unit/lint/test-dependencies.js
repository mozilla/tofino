// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import fs from 'fs-promise';
import without from 'lodash/without';
import intersection from 'lodash/intersection';
import path from 'path';
import { REQUIRES_REGEX, IMPORTS_REGEX, globMany, regexFiles } from './shared';

const all = '/**/';
const valid = '*.@(js|jsx)';

// Node and electron native modules
const native = [
  'assert',
  'child_process',
  'electron',
  'fs',
  'os',
  'path',
  'stream',
  'timers',
];

describe('dependencies', () => {
  let appPackages;
  let mainPackages;
  let mainDevPackages;
  let prodPackages;

  beforeEach(async function() {
    const appManifest = await fs.readJson(path.join('app', 'package.json'));
    const mainManifest = await fs.readJson(path.join('package.json'));

    appPackages = Object.keys(appManifest.dependencies).sort();
    mainPackages = Object.keys(mainManifest.dependencies).sort();
    mainDevPackages = Object.keys(mainManifest.devDependencies).sort();
    prodPackages = [...appPackages, ...mainPackages].sort();
  });

  it('– shared code doesn\'t directly use native modules', async function() {
    const paths = [
      `app/shared${all}${valid}`,
    ];

    const ignored = [
      // Used for communicating with the main process.
      'electron',
      // Used for bunyan logging.
      'stream',
    ];

    const sources = await globMany(paths);
    const matches = await regexFiles(sources, REQUIRES_REGEX, IMPORTS_REGEX);

    const usedPackages = without(matches, ...ignored).sort();
    expect(intersection(usedPackages, prodPackages)).toEqual(usedPackages);
  });

  it('– frontend code doesn\'t directly use native modules', async function() {
    const paths = [
      `app/ui${all}${valid}`,
    ];

    const sources = await globMany(paths);
    const matches = await regexFiles(sources, REQUIRES_REGEX, IMPORTS_REGEX);

    const usedPackages = matches.sort();
    expect(intersection(usedPackages, prodPackages)).toEqual(usedPackages);
  });

  it('– processes only use app dependencies or main dependencies', async function() {
    const paths = [
      `app/main${all}${valid}`,
      `app/services${all}${valid}`,
      `app/shared${all}${valid}`,
      `app/ui${all}${valid}`,
    ];

    const unimported = [
      // Not imported, but referenced by bin/user-agent-service script.
      'datomish-user-agent-service',
    ];

    const sources = await globMany(paths);
    const matches = await regexFiles(sources, REQUIRES_REGEX, IMPORTS_REGEX);

    // Stripping out the native node modules and adding the custom used packages
    // should leave only the main `package.json` plus the `app/package.json`
    // production dependencies.
    const usedPackages = [...without(matches, ...native), ...unimported].sort();
    expect(usedPackages).toEqual(prodPackages);

    const installedUnimported = intersection(unimported, [...appPackages, ...mainPackages]);
    expect(installedUnimported).toEqual(unimported);
  });

  it('– build and test code only use main dependencies or devDependencies', async function() {
    const paths = [
      `build${all}${valid}`,
      `test${all}${valid}`,
    ];

    const unimported = [
      // Modules not imported anywhere, but used at the CLI.
      'cross-env',

      // Test modules not imported anywhere, but used at the CLI.
      'mocha',
      'electron-mocha',
      'coveralls',
      'nyc',

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

    const sources = await globMany(paths);
    const matches = await regexFiles(sources, REQUIRES_REGEX, IMPORTS_REGEX);

    // Stripping out the production and native node modules, and adding the
    // custom used packages should leave only the main `package.json`
    // development dependencies.
    const usedPackages = [...without(matches, ...mainPackages, ...native), ...unimported].sort();
    expect(usedPackages).toEqual(mainDevPackages);

    const installedUnimported = intersection(unimported, [...mainPackages, ...mainDevPackages]);
    expect(installedUnimported).toEqual(unimported);
  });
});
