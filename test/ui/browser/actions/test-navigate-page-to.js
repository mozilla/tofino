// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import configureStore from '../../../../app/ui/browser/store/store';
import * as actions from '../../../../app/ui/browser/actions/main-actions';
import * as selectors from '../../../../app/ui/browser/selectors';

const RUST_URL = 'http://rust-lang.org';

describe('Action - NAVIGATE_PAGE_TO', () => {
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

  it('Should execute navigate commands in page', function() {
    const { dispatch, getPages } = this;
    const id = getPages().get(1).id;

    dispatch(actions.navigatePageTo(id, RUST_URL));

    expect(getPages().get(1).commands.size).toEqual(1);
    expect(getPages().get(1).commands.get(0).command).toEqual('navigate-to');
    expect(getPages().get(1).commands.get(0).location).toEqual(RUST_URL);

    dispatch(actions.navigatePageTo(id, `${RUST_URL}/documentation.html`));
    expect(getPages().get(1).commands.size).toEqual(2);
    expect(getPages().get(1).commands.get(1).command).toEqual('navigate-to');
    expect(getPages().get(1).commands.get(1).location).toEqual(
      `${RUST_URL}/documentation.html`);
  });
});
