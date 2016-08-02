// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import fs from 'fs';
import path from 'path';
import glob from 'glob';
import { CLIEngine } from 'eslint';
import { ROOT } from '../../../build/utils/const';

const valid = '**/*.@(js|jsx)';

// Load the ignore list
let ignore = fs.readFileSync(path.join(ROOT, '.eslintignore'), {
  encoding: 'utf8',
}).split('\n');

// Strip the comments
ignore = ignore.filter(i => i.length && !i.startsWith('#'));

const files = glob.sync(valid, {
  cwd: ROOT,
  ignore,
});

const engine = new CLIEngine({
  cwd: ROOT,
  useEslintrc: true,
});

describe('eslint', () => {
  // Doing this for all files at once shaves 33% off the execution time!
  const results = engine.executeOnFiles(files);

  for (const result of results.results) {
    const file = path.relative(ROOT, result.filePath);

    it(`should have found no errors in ${file}`, () => {
      if (result.messages.length) {
        const message = result.messages[0];
        throw new Error(`Line ${message.line}, Col ${message.column}: ` +
                        `${message.message} (${message.ruleId})`);
      }
    });
  }
});
