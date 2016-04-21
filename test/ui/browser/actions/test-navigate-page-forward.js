// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import configureStore from '../../../../app/ui/browser/store/store';
import * as actions from '../../../../app/ui/browser/actions/main-actions';

describe('Action - NAVIGATE_PAGE_FORWARD', () => {
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

  it('Should execute navigate forward commands in page', function() {
    const { dispatch, getState } = this;
    const ids = getState().pages.map(p => p.id);

    // Ensure page can go forward
    dispatch(actions.setPageDetails(ids.get(1), { canGoForward: true }));

    dispatch(actions.navigatePageForward(ids.get(1)));
    expect(getState().pages.get(1).commands.size).toEqual(1);
    expect(getState().pages.get(1).commands.get(0).command).toEqual('forward');

    dispatch(actions.navigatePageForward(ids.get(1)));
    expect(getState().pages.get(1).commands.size).toEqual(2);
    expect(getState().pages.get(1).commands.get(1).command).toEqual('forward');
  });

  it('Should throw if page cannot go forward', function() {
    const { dispatch, getState } = this;

    // Ensure page cannot go forward
    dispatch(actions.setPageDetails(getState().pages.get(1).id, { canGoForward: false }));

    try {
      dispatch(actions.navigatePageForward(getState().pages.get(1).id));
      expect(false).toEqual(true,
        'Expected NAVIGATE_PAGE_FORWARD to throw when page cannot go forward.');
    } catch (e) {
      expect(true).toEqual(true,
        'Expected NAVIGATE_PAGE_FORWARD to throw when page cannot go forward.');
    }
    expect(getState().pages.get(2).commands.size).toEqual(0);
  });
});
