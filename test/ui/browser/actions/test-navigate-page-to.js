// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import configureStore from '../../../../app/ui/browser/store/store';
import * as actions from '../../../../app/ui/browser/actions/main-actions';
import { createWebViewMocks } from '../utils';

const RUST_URL = 'http://rust-lang.org';

describe('Action - NAVIGATE_PAGE_TO', () => {
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

  it('Should execute navigate commands in page', function() {
    const { win, dispatch, getState } = this;
    const id = getState().pages.get(1).id;

    dispatch(actions.navigatePageTo(id, RUST_URL, win.document));

    expect(win.document.querySelector(`#webview-${id}`).getAttribute('src'))
      .toEqual(RUST_URL);

    dispatch(actions.navigatePageTo(id, `${RUST_URL}/documentation.html`, win.document));
    expect(win.document.querySelector(`#webview-${id}`).getAttribute('src'))
      .toEqual(`${RUST_URL}/documentation.html`);
  });
});
