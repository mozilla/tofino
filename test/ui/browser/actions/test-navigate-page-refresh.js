// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import configureStore from '../../../../app/ui/browser/store/store';
import * as actions from '../../../../app/ui/browser/actions/main-actions';
import * as selectors from '../../../../app/ui/browser/selectors';

describe('Action - NAVIGATE_PAGE_REFRESH', () => {
  beforeEach(function() {
    this.store = configureStore();
    this.getPages = () => selectors.getPages(this.store.getState());
    this.dispatch = this.store.dispatch;
    const { dispatch } = this;
    dispatch(actions.createTab('http://moz1.org'));
    dispatch(actions.createTab('http://moz2.org'));
    dispatch(actions.createTab('http://moz3.org'));
    dispatch(actions.closeTab(this.getPages().get(0).id));
  });

  it('Should execute navigate refresh commands in page', function() {
    const { dispatch, getPages } = this;

    // Ensure page can refresh
    dispatch(actions.setPageDetails(getPages().get(1).id, { canRefresh: true }));

    dispatch(actions.navigatePageRefresh(getPages().get(1).id));
    expect(getPages().get(1).commands.size).toEqual(1);
    expect(getPages().get(1).commands.get(0).command).toEqual('refresh');

    dispatch(actions.navigatePageRefresh(getPages().get(1).id));
    expect(getPages().get(1).commands.size).toEqual(2);
    expect(getPages().get(1).commands.get(1).command).toEqual('refresh');
  });

  it('Should throw if page cannot refresh', function() {
    const { dispatch, getPages } = this;

    // Ensure page cannot refresh
    dispatch(actions.setPageDetails(getPages().get(1).id, { canRefresh: false }));

    try {
      dispatch(actions.navigatePageRefresh(getPages().get(1).id));
      expect(false).toEqual(true,
        'Expected NAVIGATE_PAGE_REFRESH to throw when page cannot refresh.');
    } catch (e) {
      expect(true).toEqual(true,
        'Expected NAVIGATE_PAGE_REFRESH to throw when page cannot refresh.');
    }
    expect(getPages().get(1).commands.size).toEqual(0);
  });
});
