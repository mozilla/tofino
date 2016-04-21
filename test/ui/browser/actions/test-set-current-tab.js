// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import configureStore from '../../../../app/ui/browser/store/store';
import * as actions from '../../../../app/ui/browser/actions/main-actions';

describe('Action - SET_CURRENT_TAB', () => {
  beforeEach(function() {
    this.store = configureStore();
    this.getState = () => this.store.getState().browserWindow;
    this.dispatch = this.store.dispatch;
  });

  it('Should update the current tab', function() {
    const { getState, dispatch } = this;

    dispatch(actions.createTab('http://moz.com'));
    expect(getState().pages.size).toEqual(2);
    const ids = getState().pages.map(p => p.id);

    expect(getState().currentPageIndex).toEqual(1);
    dispatch(actions.setCurrentTab(ids.get(0)));
    expect(getState().currentPageIndex).toEqual(0);
    dispatch(actions.setCurrentTab(ids.get(1)));
    expect(getState().currentPageIndex).toEqual(1);
  });
});
