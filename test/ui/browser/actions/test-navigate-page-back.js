// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import configureStore from '../../../../app/ui/browser/store/store';
import * as actions from '../../../../app/ui/browser/actions/main-actions';
import { createWebViewMocks } from '../utils';

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

    return createWebViewMocks(
      this.getState().pages.map(p => ({ id: `webview-${p.id}` }))
    ).then(win => this.win = win);
  });

  afterEach(function() {
    this.win.close();
  });

  it('Should execute navigate back commands in page', function() {
    const { win, dispatch, getState } = this;
    const ids = getState().pages.map(p => p.id);

    // Ensure page can go back
    dispatch(actions.setPageDetails(ids.get(1), { canGoBack: true }));

    dispatch(actions.navigatePageBack(ids.get(1), win.document));
    expect(win.document.querySelector(`#webview-${ids.get(1)}`).getAttribute('back-count'))
      .toEqual('1');

    dispatch(actions.navigatePageBack(ids.get(1), win.document));
    expect(win.document.querySelector(`#webview-${ids.get(1)}`).getAttribute('back-count'))
      .toEqual('2');
  });

  it('Should throw if page cannot go back', function() {
    const { win, dispatch, getState } = this;
    const ids = getState().pages.map(p => p.id);

    // Ensure page cannot go back
    dispatch(actions.setPageDetails(ids.get(1), { canGoBack: false }));

    try {
      dispatch(actions.navigatePageBack(ids.get(1), win.document));
      expect(false).toEqual(true,
        'Expected NAVIGATE_PAGE_BACK to throw when page cannot go back.');
    } catch (e) {
      expect(true).toEqual(true,
        'Expected NAVIGATE_PAGE_BACK to throw when page cannot go back.');
    }
    expect(win.document.querySelector(`#webview-${ids.get(1)}`).getAttribute('back-count'))
      .toEqual(null);
  });
});
