// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';

import {
  createHistoryRestoreUrl, prettyUrl, resolveHistoryRestoreUrl,
} from '../../../app/ui/shared/util/url-util';

const HISTORY_RESTORE_WITH_URL = 'tofino://historyrestore/?url=https%3A//www.mozilla.org/';
const HISTORY_RESTORE_WITH_HISTORY = 'tofino://historyrestore/' +
  '?history=%5B%22tofino%3A//history/%22%2C%22https%3A//www.mozilla.org/%22%5D&historyIndex=0';

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

  it('resolves historyrestore urls', () => {
    expect(prettyUrl(HISTORY_RESTORE_WITH_URL)).toBe('mozilla.org/');
  });

  it('does not resolve historyrestore urls that contain multiple histories to be injected', () => {
    expect(prettyUrl(HISTORY_RESTORE_WITH_HISTORY)).toBe(HISTORY_RESTORE_WITH_HISTORY);
  });
});

describe('resolveHistoryRestoreUrl', () => {
  it('does not resolve non-historyrestore urls', () => {
    expect(resolveHistoryRestoreUrl('https://mozilla.org/')).toBe('https://mozilla.org/');
  });

  it('resolves historyrestore urls', () => {
    expect(resolveHistoryRestoreUrl(HISTORY_RESTORE_WITH_URL)).toBe('https://www.mozilla.org/');
  });

  it('does not resolve historyrestore urls that contain multiple histories to be injected', () => {
    expect(resolveHistoryRestoreUrl(HISTORY_RESTORE_WITH_HISTORY))
      .toBe(HISTORY_RESTORE_WITH_HISTORY);
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
