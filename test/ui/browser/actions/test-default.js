// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import 'babel-polyfill';
import 'babel-register';

import expect from 'expect';
import configureStore from '../../../../ui/browser/store/store';

describe('Action - Default', () => {
  beforeEach(function() {
    this.store = configureStore();
    this.getState = () => this.store.getState().browserWindow;
    this.dispatch = this.store.dispatch;
  });

  it('Should have expected default state', function() {
    const state = this.getState();
    expect(state.currentPageIndex).toEqual(0);
    expect(state.pageAreaVisible).toEqual(false);
    expect(state.pages.size).toEqual(1);
    expect(state.pages.get(0).location).toEqual('https://www.mozilla.org/');
  });
});
