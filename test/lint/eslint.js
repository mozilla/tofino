// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import lint from 'mocha-eslint';

const all = '/**/';
const valid = '*.@(js|jsx)';

const paths = [
  `${valid}`,
  `app${all}${valid}`,
  `build${all}${valid}`,
  `shared${all}${valid}`,
  `test${all}${valid}`,
  `ui${all}${valid}`,
];

const options = {
  alwaysWarn: false,
  timeout: 10000,
};

lint(paths, options);
