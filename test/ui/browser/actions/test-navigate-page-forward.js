// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import configureStore from '../../../../app/ui/browser/store/store';
import * as actions from '../../../../app/ui/browser/actions/main-actions';
import { createWebViewMocks } from '../utils';

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

    return createWebViewMocks(
      this.getState().pages.map(p => ({ id: `webview-${p.id}` }))
    ).then(win => this.win = win);
  });

  afterEach(function() {
    this.win.close();
  });

  it('Should execute navigate forward commands in page', function() {
    const { win, dispatch, getState } = this;
    const ids = getState().pages.map(p => p.id);

    // Ensure page can go forward
    dispatch(actions.setPageDetails(ids.get(1), { canGoForward: true }));

    dispatch(actions.navigatePageForward(ids.get(1), win.document));
    expect(win.document.querySelector(`#webview-${ids.get(1)}`).getAttribute('forward-count'))
      .toEqual('1');

    dispatch(actions.navigatePageForward(ids.get(1), win.document));
    expect(win.document.querySelector(`#webview-${ids.get(1)}`).getAttribute('forward-count'))
      .toEqual('2');
  });

  it('Should throw if page cannot go forward', function() {
    const { win, dispatch, getState } = this;
    const ids = getState().pages.map(p => p.id);

    // Ensure page cannot go forward
    dispatch(actions.setPageDetails(ids.get(1), { canGoForward: false }));

    try {
      dispatch(actions.navigatePageForward(ids.get(1), win.document));
      expect(false).toEqual(true,
        'Expected NAVIGATE_PAGE_FORWARD to throw when page cannot go forward.');
    } catch (e) {
      expect(true).toEqual(true,
        'Expected NAVIGATE_PAGE_FORWARD to throw when page cannot go forward.');
    }
    expect(win.document.querySelector(`#webview-${ids.get(1)}`).getAttribute('forward-count'))
      .toEqual(null);
  });
});
