// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import path from 'path';
import expect from 'expect';
import checker from 'license-checker';
import { autoFailingAsyncTest } from '../../utils/async';
const root = path.join(__dirname, '..', '..', '..');

const WAIVED_DEPENDENCIES = [
  // tweetnacl seems to be OK, in Public Domain
  // https://github.com/dchest/tweetnacl-js/blob/master/COPYING.txt
  'tweetnacl@0.14.3',
];

const VALID_LICENSES = [
  'ISC',

  'MIT',
  'MIT*',
  'MIT/X11',

  'CC-BY-3.0',

  'AFLv2.1',

  'LGPL',
  'GPLv2',
  'GPLv3',

  'MPLv2.0',

  'Apache',
  'Apache*',
  'Apache2',
  'Apache License, Version 2.0',
  'Apache-2.0',

  'BSD',
  'BSD-2-Clause',
  'BSD-3-Clause',
  'BSD-like',
  'BSD*',

  'EPL',

  'Artistic-2.0',

  // Questionable licenses
  'WTFPL',
  'Unlicense',
  'Public Domain',
  'Public domain',
];

function isValidLicense(license) {
  // If parentheses in string, like "(MIT OR BSD)", then just
  // strip it out.
  const matched = license.match(/^\((.*)\)$/);
  if (matched && matched[1]) {
    license = matched[1];
  }

  // Otherwise, apply the boolean logic of AND or OR'ing the licenses.
  if (/ AND /.test(license)) {
    return license.split(' AND ').every(l => VALID_LICENSES.includes(l));
  } else if (/ OR /.test(license)) {
    return license.split(' OR ').some(l => VALID_LICENSES.includes(l));
  } else {
    return VALID_LICENSES.includes(license);
  }
}

describe('licenses', () => {
  it('should be compatible licenses', autoFailingAsyncTest(async function() {
    const licenseInfo = await new Promise(resolve => {
      checker.init({
        start: root,
        depth: 'all',
        include: 'all',
      }, resolve);
    });

    const invalidDeps = Object.keys(licenseInfo).filter(dep => {
      const licenses = licenseInfo[dep].licenses;
      return !([].concat(licenses).every(isValidLicense));
    }).filter(dep => {
      return !WAIVED_DEPENDENCIES.includes(dep);
    });

    invalidDeps.forEach(dep => {
      // Should change to fail test!
      console.error(`Invalid license for ${dep}: ${licenseInfo[dep].licenses}`);
    });
  }));
});
