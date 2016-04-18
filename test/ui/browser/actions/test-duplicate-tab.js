// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import 'babel-polyfill';
import 'babel-register';

import expect from 'expect';
import configureStore from '../../../../ui/browser/store/store';
import * as actions from '../../../../ui/browser/actions/main-actions';

describe('Action - DUPLICATE_TAB', () => {
  beforeEach(function() {
    this.store = configureStore();
    this.getState = () => this.store.getState().browserWindow;
    this.dispatch = this.store.dispatch;
  });

  it('Should create a new tab with source\'s location and select it', function() {
    const { getState, dispatch } = this;
    expect(getState().currentPageIndex).toEqual(0);

    dispatch(actions.createTab('https://moz.org/1'));
    dispatch(actions.createTab('https://moz.org/2'));
    dispatch(actions.createTab('https://moz.org/3'));

    dispatch(actions.duplicateTab(1));
    expect(getState().pages.size).toEqual(5);
    expect(getState().pages.get(4).location).toEqual('https://moz.org/1',
      'DUPLICATE_TAB creates an appends a new tab with source\'s location');
    expect(getState().currentPageIndex).toEqual(4,
      'DUPLICATE_TAB updates `currentPageIndex` with new duplicated tab');
  });
});
