// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import fs from 'fs-promise';
import glob from 'glob';
import difference from 'lodash/difference';

const all = '/**/';
const valid = '*.@(js|jsx)';

const paths = [
  `app${all}${valid}`,
  `build${all}${valid}`,
  `shared${all}${valid}`,
  `test${all}${valid}`,
  `ui${all}${valid}`,
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

// We can afford being a little more relaxed with the regexes here
// since we have very strict eslint rules about whitespace.
const requires = /require\('([\w-/]+)'\)/g;
const imports = /import(?:.*?from)?\s+'([\w-/]+)'/g;

describe('packages', () => {
  it('should not be orpahned', test(async function() {
    const manifest = await fs.readJson('package.json');
    const modules = [
      ...Object.keys(manifest.dependencies),
      ...Object.keys(manifest.devDependencies),
    ];

    const sources = await globMany(paths);
    const matches = await regexFiles(sources, requires, imports);
    const expected = Array.from(new Set([...matches, ...ignored]));

    expect(difference(modules, expected)).toEqual([]);
  }));
});

function test(runner) {
  return async function(done) {
    let caught;
    try {
      await runner();
    } catch (err) {
      caught = err;
    }
    done(caught);
  };
}

function globOne(wildcard) {
  return new Promise((resolve, reject) => {
    glob(wildcard, {}, (err, files) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(files);
    });
  });
}

async function globMany(wildcards) {
  let out = [];
  for (const wildcard of wildcards) {
    const files = await globOne(wildcard);
    out = out.concat(files);
  }
  return out;
}

async function regexSingleFile(path, regexps) {
  const contents = await fs.readFile(path, 'utf8');
  let out = [];

  for (const regex of regexps) {
    let match = regex.exec(contents);

    while (match) {
      const [, ...captures] = match;

      // In the case of submodule imports e.g. 'lodash/throttle', we're only
      // interested in the main module path component.
      const modules = captures.map(e => e.split('/')[0]);
      out = out.concat(modules);
      match = regex.exec(contents);
    }
  }
  return out;
}

async function regexFiles(files, ...regexps) {
  let out = [];
  for (const file of files) {
    const matches = await regexSingleFile(file, regexps);
    out = out.concat(matches);
  }
  return Array.from(new Set(out));
}
