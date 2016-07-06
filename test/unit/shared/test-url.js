// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';

import { prettyUrl } from '../../../app/shared/url';

describe('prettyUrl', () => {
  it('Strips http, https protocols', () => {
    expect(prettyUrl('http://mozilla.org/')).toBe('mozilla.org/');
    expect(prettyUrl('https://mozilla.org/')).toBe('mozilla.org/');
    expect(prettyUrl('tofino://history')).toBe('tofino://history');
  });

  it('Strips only www subdomains', () => {
    expect(prettyUrl('http://www.mozilla.org/')).toBe('mozilla.org/');
    expect(prettyUrl('https://firefox.mozilla.org/')).toBe('firefox.mozilla.org/');
  });
});
