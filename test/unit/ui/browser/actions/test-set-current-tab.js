/* @flow */

// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import { createBrowserStore } from '../../../../../app/ui/browser/store';
import * as actions from '../../../../../app/ui/browser/actions/main-actions';
import * as selectors from '../../../../../app/ui/browser/selectors';

describe('Action - SET_CURRENT_TAB', () => {
  beforeEach(function() {
    this.store = createBrowserStore();
    this.getPages = () => selectors.getPages(this.store.getState());
    this.getCurrentPageIndex = () => selectors.getCurrentPageIndex(this.store.getState());
    this.dispatch = this.store.dispatch;
  });

  it('Should update the current tab', function() {
    const { getCurrentPageIndex, getPages, dispatch } = this;

    dispatch(actions.createTab());
    dispatch(actions.createTab('http://moz.com'));
    expect(getPages().size).toEqual(2);
    const ids = getPages().map(p => p.id);

    expect(getCurrentPageIndex()).toEqual(1);
    dispatch(actions.setCurrentTab(ids.get(0)));
    expect(getCurrentPageIndex()).toEqual(0);
    dispatch(actions.setCurrentTab(ids.get(1)));
    expect(getCurrentPageIndex()).toEqual(1);
  });
});
