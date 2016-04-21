// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';

import configureStore from '../../../../app/ui/browser/store/store';
import * as actions from '../../../../app/ui/browser/actions/main-actions';

/**
 * Takes a pages List and maps the location ('http://moz1.org')
 * to just it's number, '1', and into a string for testing ordering here.
 */
function serialize(list) {
  return list.map(p => /moz(\d)\.org/.exec(p.location)[1]).join(',');
}

function getSelectedPageURL(state) {
  return state.pages.get(state.currentPageIndex).location;
}

describe('Action - SET_PAGE_ORDER', () => {
  beforeEach(function() {
    this.store = configureStore();
    this.getState = () => this.store.getState().browserWindow;
    this.dispatch = this.store.dispatch;

    const { dispatch, getState } = this;
    dispatch(actions.createTab('http://moz1.org'));
    dispatch(actions.createTab('http://moz2.org'));
    dispatch(actions.createTab('http://moz3.org'));
    dispatch(actions.createTab('http://moz4.org'));
    dispatch(actions.createTab('http://moz5.org'));

    const ids = this.ids = getState().pages.reduce((o, p, i) => {
      o[`moz${i}`] = p.id;
      return o;
    }, {});

    dispatch(actions.closeTab(ids.moz0));
    expect(getState().pages.size).toEqual(5);
    dispatch(actions.setCurrentTab(ids.moz1));
    expect(getState().currentPageIndex).toEqual(0);
  });

  it('Should update page order when moving a tab to the left', function() {
    const { dispatch, getState, ids } = this;

    dispatch(actions.setPageOrder(ids.moz5, 2));
    expect(getState().pages.size).toEqual(5);
    expect(serialize(getState().pages)).toEqual([
      '1', '2', '5', '3', '4',
    ].toString());
    expect(getSelectedPageURL(getState()), 'http://moz1.org',
      'currentPageIndex should still reference currently selected page');
  });

  it('Should update page order when moving a tab to the right', function() {
    const { dispatch, getState, ids } = this;

    dispatch(actions.setPageOrder(ids.moz4, 0));
    expect(getState().pages.size).toEqual(5);
    expect(serialize(getState().pages)).toEqual([
      '4', '1', '2', '3', '5',
    ].toString());
    expect(getSelectedPageURL(getState()), 'http://moz1.org',
      'currentPageIndex should still reference currently selected page');
  });

  it('Should still reference currently selected page when moving current page', function() {
    const { dispatch, getState, ids } = this;

    dispatch(actions.setCurrentTab(ids.moz3));
    dispatch(actions.setPageOrder(ids.moz3, 0));
    expect(serialize(getState().pages)).toEqual([
      '3', '1', '2', '4', '5',
    ].toString());
    expect(getSelectedPageURL(getState()), 'http://moz3.org',
      'currentPageIndex should still reference currently selected page');
  });

  it('Should still reference currently selected page when moving page after', function() {
    const { dispatch, getState, ids } = this;

    dispatch(actions.setCurrentTab(ids.moz3));
    dispatch(actions.setPageOrder(ids.moz1, 4));
    expect(serialize(getState().pages)).toEqual([
      '2', '3', '4', '5', '1',
    ].toString());
    expect(getSelectedPageURL(getState()), 'http://moz3.org',
      'currentPageIndex should still reference currently selected page');
  });

  it('Should still reference currently selected page when moving page before', function() {
    const { dispatch, getState, ids } = this;

    dispatch(actions.setCurrentTab(ids.moz3));
    dispatch(actions.setPageOrder(ids.moz5, 0));
    expect(serialize(getState().pages)).toEqual([
      '5', '1', '2', '3', '4',
    ].toString());
    expect(getSelectedPageURL(getState()), 'http://moz3.org',
      'currentPageIndex should still reference currently selected page');
  });
});
