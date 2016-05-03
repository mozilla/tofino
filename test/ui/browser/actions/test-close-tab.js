// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import configureStore from '../../../../app/ui/browser/store/store';
import * as actions from '../../../../app/ui/browser/actions/main-actions';
import * as selectors from '../../../../app/ui/browser/selectors';

describe('Action - CLOSE_TAB', () => {
  beforeEach(function() {
    this.store = configureStore();
    this.getPages = () => selectors.getPages(this.store.getState());
    this.getCurrentPageIndex = () => selectors.getCurrentPageIndex(this.store.getState());
    this.dispatch = this.store.dispatch;

    const { getCurrentPageIndex, getPages, dispatch } = this;
    dispatch(actions.createTab('https://moz.org/1'));
    dispatch(actions.createTab('https://moz.org/2'));
    dispatch(actions.createTab('https://moz.org/3'));
    expect(getCurrentPageIndex()).toEqual(3);
    expect(getPages().size).toEqual(4);
  });

  it('Should maintain tab selection when destroying a tab before the selected tab', function() {
    const { getCurrentPageIndex, getPages, dispatch } = this;
    const ids = getPages().map(p => p.id);

    dispatch(actions.closeTab(ids.get(1)));
    expect(getPages().size).toEqual(3);
    expect(getPages().get(0).location).toEqual('tofino://mozilla');
    expect(getPages().get(1).location).toEqual('https://moz.org/2');
    expect(getPages().get(2).location).toEqual('https://moz.org/3');
    expect(getCurrentPageIndex()).toEqual(2,
      'CLOSE_TAB does not update selected tab if the tab destroyed was not selected.');
  });

  it('Should maintain tab selection when destroying a tab after the selected tab', function() {
    const { getCurrentPageIndex, getPages, dispatch } = this;
    const ids = getPages().map(p => p.id);

    dispatch(actions.setCurrentTab(ids.get(1)));
    dispatch(actions.closeTab(ids.get(3)));

    expect(getPages().size).toEqual(3);
    expect(getPages().get(1).location).toEqual('https://moz.org/1');
    expect(getCurrentPageIndex()).toEqual(1,
      'CLOSE_TAB does not update selected tab if the tab destroyed was not selected.');
  });

  it('Should destroy a selected tab and select next when it is not last tab', function() {
    const { getCurrentPageIndex, getPages, dispatch } = this;
    const ids = getPages().map(p => p.id);

    dispatch(actions.setCurrentTab(ids.get(1)));
    dispatch(actions.closeTab(ids.get(1)));

    expect(getPages().size).toEqual(3);
    expect(getPages().get(1).location).toEqual('https://moz.org/2');
    expect(getCurrentPageIndex()).toEqual(1,
      'CLOSE_TAB on selected tab selects the next tab');
  });

  it('Should destroy a selected tab and select previous when it is the last tab', function() {
    const { getCurrentPageIndex, getPages, dispatch } = this;
    const ids = getPages().map(p => p.id);

    dispatch(actions.closeTab(ids.get(3)));
    expect(getPages().size).toEqual(3);
    expect(getPages().get(2).location).toEqual('https://moz.org/2');
    expect(getCurrentPageIndex()).toEqual(2,
      'CLOSE_TAB on last selected tab selects the previous tab');
  });

  it('Destroying the last tab should reset state', function() {
    const { getCurrentPageIndex, getPages, dispatch } = this;
    const ids = getPages().map(p => p.id);
    dispatch(actions.closeTab(ids.get(3)));
    dispatch(actions.closeTab(ids.get(2)));
    dispatch(actions.closeTab(ids.get(1)));
    expect(getCurrentPageIndex()).toEqual(0);
    expect(getPages().size).toEqual(1);

    dispatch(actions.closeTab(ids.get(0)));
    expect(getCurrentPageIndex()).toEqual(0);
    expect(getPages().size).toEqual(1);
    expect(getPages().get(0).location).toEqual('tofino://mozilla');
  });
});
