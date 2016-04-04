
import expect from 'expect';
import { State, Page } from '../../../ui/browser/model/index';

describe('Data model: Page', function() {
  it('should do the basics', function() {
    const page1 = new Page();
    expect(page1.location).toEqual(undefined);
    expect(page1.title).toEqual('New Tab');

    const page2 = new Page({ location: 'https://www.mozilla.org' });
    expect(page2.location).toEqual('https://www.mozilla.org');
    expect(page2.title).toEqual('New Tab');
  });
});

describe('Data model: State', function() {
  it('should do the basics', function() {
    const state1 = new State();
    expect(state1.pages.size).toEqual(0);
    expect(state1.pageOrder.size).toEqual(0);
    expect(state1.currentPageIndex).toEqual(-1);
  });
});
