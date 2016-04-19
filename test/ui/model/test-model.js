// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import { State, Page } from '../../../app/ui/browser/model/index';

describe('Data model: Page', () => {
  it('should do the basics', () => {
    const page1 = new Page();
    expect(page1.location).toEqual(undefined);
    expect(page1.title).toEqual('New Tab');

    const page2 = new Page({ location: 'https://www.mozilla.org' });
    expect(page2.location).toEqual('https://www.mozilla.org');
    expect(page2.title).toEqual('New Tab');
  });
});

describe('Data model: State', () => {
  it('should do the basics', () => {
    const state1 = new State();
    expect(state1.pages.size).toEqual(0);
    expect(state1.currentPageIndex).toEqual(-1);
  });
});
