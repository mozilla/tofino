// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import lint from 'mocha-eslint';
import { quickTest } from '../../build-config';

const all = '/**/';
const valid = '*.@(js|jsx)';

const paths = [
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

if (!quickTest) {
  lint(paths, options);
}
