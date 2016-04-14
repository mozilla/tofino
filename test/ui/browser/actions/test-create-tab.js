// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import configureStore from '../../../../ui/browser/store/store';
import * as actions from '../../../../ui/browser/actions/main-actions';

const HOME_PAGE = 'https://www.mozilla.org/';

describe('Action - CREATE_TAB', () => {
  beforeEach(function() {
    this.store = configureStore();
  });

  it('Should create a new tab with default location and select it', function() {
    const { getState, dispatch } = this.store;
    expect(getState().currentPageIndex).toEqual(0);

    dispatch(actions.createTab());
    expect(getState().pages.size).toEqual(2);
    expect(getState().pages.get(1).location).toEqual(HOME_PAGE,
      'CREATE_TAB defaults to home page when no location given.');
    expect(getState().currentPageIndex).toEqual(1,
      'CREATE_TAB updates `currentPageIndex` when creating a new tab');
  });

  it('Should create a new tab with given location and select it', function() {
    const { getState, dispatch } = this.store;
    dispatch(actions.createTab());
    dispatch(actions.createTab('https://github.com/'));

    expect(getState().pages.size).toEqual(3);
    expect(getState().pages.get(2).location).toEqual('https://github.com/',
      'CREATE_TAB uses passed in location for new tab');
    expect(getState().currentPageIndex).toEqual(2,
      'CREATE_TAB updates `currentPageIndex` when creating a new tab with location');
  });
});
