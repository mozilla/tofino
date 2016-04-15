// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import configureStore from '../../../../ui/browser/store/store';
import * as actions from '../../../../ui/browser/actions/main-actions';

describe('Action - SET_CURRENT_TAB', () => {
  beforeEach(function() {
    this.store = configureStore();
  });

  it('Should update the current tab', function() {
    const { getState, dispatch } = this.store;

    dispatch(actions.createTab('http://moz.com'));
    expect(getState().pages.size).toEqual(2);

    expect(getState().currentPageIndex).toEqual(1);
    dispatch(actions.setCurrentTab(0));
    expect(getState().currentPageIndex).toEqual(0);
    dispatch(actions.setCurrentTab(1));
    expect(getState().currentPageIndex).toEqual(1);
  });
});
