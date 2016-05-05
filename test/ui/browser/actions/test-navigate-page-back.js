/* @flow */

// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import configureStore from '../../../../app/ui/browser/store/store';
import * as actions from '../../../../app/ui/browser/actions/main-actions';
import * as selectors from '../../../../app/ui/browser/selectors';

describe('Action - NAVIGATE_PAGE_BACK', () => {
  beforeEach(function() {
    this.store = configureStore();
    this.getPages = () => selectors.getPages(this.store.getState());
    this.dispatch = this.store.dispatch;
    const { dispatch } = this;
    dispatch(actions.createTab('http://moz1.org'));
    dispatch(actions.createTab('http://moz2.org'));
    dispatch(actions.createTab('http://moz3.org'));
  });

  it('Should execute navigate back commands in page', function() {
    const { dispatch, getPages } = this;
    const ids = getPages().map(p => p.id);

    // Ensure page can go back
    dispatch(actions.setPageDetails(ids.get(1), { canGoBack: true }));

    dispatch(actions.navigatePageBack(ids.get(1)));
    expect(getPages().get(1).commands.size).toEqual(1);
    expect(getPages().get(1).commands.get(0).command).toEqual('back');

    dispatch(actions.navigatePageBack(ids.get(1)));
    expect(getPages().get(1).commands.size).toEqual(2);
    expect(getPages().get(1).commands.get(1).command).toEqual('back');
  });

  it('Should throw if page cannot go back', function() {
    const { dispatch, getPages } = this;
    const ids = getPages().map(p => p.id);

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
    expect(getPages().get(2).commands.size).toEqual(0);
  });
});
