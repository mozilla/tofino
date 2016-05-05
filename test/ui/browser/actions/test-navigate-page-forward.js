/* @flow */

// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import configureStore from '../../../../app/ui/browser/store/store';
import * as actions from '../../../../app/ui/browser/actions/main-actions';
import * as selectors from '../../../../app/ui/browser/selectors';

describe('Action - NAVIGATE_PAGE_FORWARD', () => {
  beforeEach(function() {
    this.store = configureStore();
    this.getPages = () => selectors.getPages(this.store.getState());
    this.dispatch = this.store.dispatch;
    const { dispatch } = this;
    dispatch(actions.createTab('http://moz1.org'));
    dispatch(actions.createTab('http://moz2.org'));
    dispatch(actions.createTab('http://moz3.org'));
  });

  it('Should execute navigate forward commands in page', function() {
    const { dispatch, getPages } = this;
    const ids = getPages().map(p => p.id);

    // Ensure page can go forward
    dispatch(actions.setPageDetails(ids.get(1), { canGoForward: true }));

    dispatch(actions.navigatePageForward(ids.get(1)));
    expect(getPages().get(1).commands.size).toEqual(1);
    expect(getPages().get(1).commands.get(0).command).toEqual('forward');

    dispatch(actions.navigatePageForward(ids.get(1)));
    expect(getPages().get(1).commands.size).toEqual(2);
    expect(getPages().get(1).commands.get(1).command).toEqual('forward');
  });

  it('Should throw if page cannot go forward', function() {
    const { dispatch, getPages } = this;

    // Ensure page cannot go forward
    dispatch(actions.setPageDetails(getPages().get(1).id, { canGoForward: false }));

    try {
      dispatch(actions.navigatePageForward(getPages().get(1).id));
      expect(false).toEqual(true,
        'Expected NAVIGATE_PAGE_FORWARD to throw when page cannot go forward.');
    } catch (e) {
      expect(true).toEqual(true,
        'Expected NAVIGATE_PAGE_FORWARD to throw when page cannot go forward.');
    }
    expect(getPages().get(2).commands.size).toEqual(0);
  });
});
