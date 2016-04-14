// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import configureStore from '../../../../ui/browser/store/store';

describe('Action - Default', () => {
  beforeEach(function() {
    this.store = configureStore();
  });

  it('Should have expected default state', function() {
    const state = this.store.getState();
    expect(state.currentPageIndex).toEqual(0);
    expect(state.pageAreaVisible).toEqual(false);
    expect(state.pages.size).toEqual(1);
    expect(state.pages.get(0).location).toEqual('https://www.mozilla.org/');
  });
});
