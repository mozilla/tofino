// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import configureStore from '../../../../app/ui/browser/store/store';
import * as actions from '../../../../app/ui/browser/actions/main-actions';

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
  });

  it('Should execute navigate commands in page', function() {
    const { dispatch, getState } = this;
    const id = getState().pages.get(1).id;

    dispatch(actions.navigatePageTo(id, RUST_URL));

    expect(getState().pages.get(1).commands.size).toEqual(1);
    expect(getState().pages.get(1).commands.get(0).command).toEqual('navigate-to');
    expect(getState().pages.get(1).commands.get(0).location).toEqual(RUST_URL);

    dispatch(actions.navigatePageTo(id, `${RUST_URL}/documentation.html`));
    expect(getState().pages.get(1).commands.size).toEqual(2);
    expect(getState().pages.get(1).commands.get(1).command).toEqual('navigate-to');
    expect(getState().pages.get(1).commands.get(1).location).toEqual(
      `${RUST_URL}/documentation.html`);
  });
});
