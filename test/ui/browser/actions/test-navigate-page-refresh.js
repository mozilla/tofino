// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import configureStore from '../../../../app/ui/browser/store/store';
import * as actions from '../../../../app/ui/browser/actions/main-actions';

describe('Action - NAVIGATE_PAGE_REFRESH', () => {
  beforeEach(function() {
    this.store = configureStore();
    this.getState = () => this.store.getState().browserWindow;
    this.dispatch = this.store.dispatch;
    const { dispatch } = this;
    dispatch(actions.createTab('http://moz1.org'));
    dispatch(actions.createTab('http://moz2.org'));
    dispatch(actions.createTab('http://moz3.org'));
    dispatch(actions.closeTab(0));
  });

  it('Should execute navigate refresh commands in page', function() {
    const { dispatch, getState } = this;

    // Ensure page can refresh
    dispatch(actions.setPageDetails({ pageIndex: 1, canRefresh: true }));

    dispatch(actions.navigatePageRefresh(1));
    expect(getState().pages.get(1).commands.size).toEqual(1);
    expect(getState().pages.get(1).commands.get(0).command).toEqual('refresh');

    dispatch(actions.navigatePageRefresh(1));
    expect(getState().pages.get(1).commands.size).toEqual(2);
    expect(getState().pages.get(1).commands.get(1).command).toEqual('refresh');
  });

  it('Should execute navigate refresh commands in current page if -1 specified', function() {
    const { dispatch, getState } = this;

    // Ensure page can refresh
    dispatch(actions.setPageDetails({ pageIndex: 2, canRefresh: true }));

    dispatch(actions.navigatePageRefresh(-1));
    expect(getState().currentPageIndex).toEqual(2);
    expect(getState().pages.get(2).commands.size).toEqual(1);
    expect(getState().pages.get(2).commands.get(0).command).toEqual('refresh');
  });

  it('Should throw if page cannot refresh', function() {
    const { dispatch, getState } = this;

    // Ensure page cannot refresh
    dispatch(actions.setPageDetails({ pageIndex: 1, canRefresh: false }));

    try {
      dispatch(actions.navigatePageRefresh(1));
      expect(false).toEqual(true,
        'Expected NAVIGATE_PAGE_REFRESH to throw when page cannot refresh.');
    } catch (e) {
      expect(true).toEqual(true,
        'Expected NAVIGATE_PAGE_REFRESH to throw when page cannot refresh.');
    }
    expect(getState().pages.get(1).commands.size).toEqual(0);
  });
});
