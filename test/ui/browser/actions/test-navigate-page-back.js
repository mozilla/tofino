// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import configureStore from '../../../../app/ui/browser/store/store';
import * as actions from '../../../../app/ui/browser/actions/main-actions';

describe('Action - NAVIGATE_PAGE_BACK', () => {
  beforeEach(function() {
    this.store = configureStore();
    this.getState = () => this.store.getState().browserWindow;
    this.dispatch = this.store.dispatch;
    const { dispatch } = this;
    dispatch(actions.createTab('http://moz1.org'));
    dispatch(actions.createTab('http://moz2.org'));
    dispatch(actions.createTab('http://moz3.org'));
    dispatch(actions.closeTab(this.getState().pages.get(0).id));
  });

  it('Should execute navigate back commands in page', function() {
    const { dispatch, getState } = this;
    const ids = getState().pages.map(p => p.id);

    // Ensure page can go back
    dispatch(actions.setPageDetails(ids.get(1), { canGoBack: true }));

    dispatch(actions.navigatePageBack(ids.get(1)));
    expect(getState().pages.get(1).commands.size).toEqual(1);
    expect(getState().pages.get(1).commands.get(0).command).toEqual('back');

    dispatch(actions.navigatePageBack(ids.get(1)));
    expect(getState().pages.get(1).commands.size).toEqual(2);
    expect(getState().pages.get(1).commands.get(1).command).toEqual('back');
  });

  it('Should throw if page cannot go back', function() {
    const { dispatch, getState } = this;
    const ids = getState().pages.map(p => p.id);

    // Ensure page cannot go back
    dispatch(actions.setPageDetails(ids.get(1), { canGoBack: false }));

    try {
      dispatch(actions.navigatePageBack(ids.get(1)));
      expect(false).toEqual(true,
        'Expected NAVIGATE_PAGE_BACK to throw when page cannot go back.');
    } catch (e) {
      expect(true).toEqual(true,
        'Expected NAVIGATE_PAGE_BACK to throw when page cannot go back.');
    }
    expect(getState().pages.get(2).commands.size).toEqual(0);
  });
});
