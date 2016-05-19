// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/* eslint arrow-body-style: 0 */

import lint from 'mocha-eslint';
import fs from 'fs';
import path from 'path';

const valid = '*.@(js|jsx)';

// Load the ignore list
let paths = fs.readFileSync(path.join(__dirname, '..', '..', '.eslintignore'), {
  encoding: 'utf8',
}).split('\n');

// Strip the comments and invert the expressions
paths = paths.filter(i => i.length && !i.startsWith('#'))
             .map(i => { return i.startsWith('!') ? i.substr(1) : `!${i}`; });

// ESLint always ignores node_modules
paths.unshift('!node_modules/**/*');

// Prepend the full set of files
paths.unshift(`**/${valid}`);

const options = {
  alwaysWarn: false,
  timeout: 10000,
};

lint(paths, options);
