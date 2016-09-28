// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import { version as mainVersion } from '../../../package.json';
import { version as appVersion } from '../../../app/package.json';

// If the versions are out of sync then the update system breaks
describe('manifest version', () => {
  it('should match app manifest version', function() {
    expect(mainVersion).toEqual(appVersion);
  });

  if ('TRAVIS_TAG' in process.env && process.env.TRAVIS_TAG !== '') {
    it('should match the tag version', function() {
      expect(`v${mainVersion}`).toEqual(process.env.TRAVIS_TAG);
    });
  }

  if ('APPVEYOR_REPO_TAG_NAME' in process.env && process.env.APPVEYOR_REPO_TAG_NAME !== '') {
    it('should match the tag version', function() {
      expect(`v${mainVersion}`).toEqual(process.env.APPVEYOR_REPO_TAG_NAME);
    });
  }
});
