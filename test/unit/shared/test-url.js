// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';

import { createHistoryRestoreUrl, prettyUrl } from '../../../app/ui/shared/util/url-util';

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

describe('createHistoryRestoreUrl', () => {
  it('Creates a serialized form of history with a history index', () => {
    const history = [
      'http://a.com',
      'http://b.com',
      'http://c.com',
    ];
    expect(createHistoryRestoreUrl(history, 1)).toBe(
      `tofino://historyrestore/?history=${escape(JSON.stringify(history))}&historyIndex=1`
    );
  });
});
