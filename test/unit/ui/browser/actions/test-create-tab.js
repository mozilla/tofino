/* @flow */

// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import fetchMock from 'fetch-mock';

import { createBrowserStore } from '../../../../../app/ui/browser-blueprint/store';
import * as actions from '../../../../../app/ui/browser-blueprint/actions/main-actions';
import * as selectors from '../../../../../app/ui/browser-blueprint/selectors';

import { HOME_PAGE } from '../../../../../app/ui/browser-blueprint/constants/ui';
import * as endpoints from '../../../../../app/shared/constants/endpoints';

describe('Action - CREATE_TAB', () => {
  beforeEach(function() {
    this.store = createBrowserStore();
    this.getPages = () => selectors.getPages(this.store.getState());
    this.getCurrentPageIndex = () => selectors.getCurrentPageIndex(this.store.getState());
    this.getCurrentPageId = () => selectors.getCurrentPage(this.store.getState()).id;
    this.showURLBar = pageId => selectors.showURLBar(this.store.getState(), pageId);
    this.focusedURLBar = pageId => selectors.focusedURLBar(this.store.getState(), pageId);
    this.dispatch = this.store.dispatch;
  });

  afterEach(fetchMock.reset);
  after(fetchMock.restore);

  it('Should create a new tab with default location and select it', function() {
    const { getCurrentPageIndex, getPages, dispatch } = this;
    expect(getCurrentPageIndex()).toEqual(-1);

    dispatch(actions.createTab());
    expect(getPages().size).toEqual(1);
    expect(getPages().get(0).location).toEqual(HOME_PAGE,
      'CREATE_TAB defaults to home page when no location given.');
    expect(getCurrentPageIndex()).toEqual(0,
      'CREATE_TAB updates `currentPageIndex` when creating a new tab');
  });

  it('Should create a new tab with given location and select it', function() {
    const { getCurrentPageIndex, getPages, dispatch } = this;
    dispatch(actions.createTab());
    dispatch(actions.createTab('https://github.com/'));

    expect(getPages().size).toEqual(2);
    expect(getPages().get(1).location).toEqual('https://github.com/',
      'CREATE_TAB uses passed in location for new tab');
    expect(getCurrentPageIndex()).toEqual(1,
      'CREATE_TAB updates `currentPageIndex` when creating a new tab with location');
  });

  it('Should create a new tab with given location and select it', function() {
    const { getCurrentPageIndex, getPages, dispatch } = this;
    dispatch(actions.createTab());
    dispatch(actions.createTab('https://github.com/'));

    expect(getPages().size).toEqual(2);
    expect(getPages().get(1).location).toEqual('https://github.com/',
                                               'CREATE_TAB uses passed in location for new tab');
    expect(getCurrentPageIndex()).toEqual(1,
                                          'CREATE_TAB updates `currentPageIndex` when creating a' +
                                          ' new tab with location');
  });

  it('Should create a new tab and focus it if selected', function() {
    const { getCurrentPageIndex, getCurrentPageId, showURLBar, focusedURLBar, dispatch } = this;
    dispatch(actions.createTab());
    dispatch(actions.setShowURLBar(getCurrentPageId(), false));
    dispatch(actions.setFocusedURLBar(getCurrentPageId(), false));

    // Assert initial conditions.
    expect(getCurrentPageIndex()).toEqual(0);
    expect(showURLBar(getCurrentPageId())).toEqual(false);
    expect(focusedURLBar(getCurrentPageId())).toEqual(false);

    dispatch(actions.createTab('https://github.com/'));

    expect(getCurrentPageIndex()).toEqual(
      1,
      'CREATE_TAB updates `currentPageIndex` when creating a new tab');
    expect(showURLBar(getCurrentPageId())).toEqual(
      true,
      'CREATE_TAB does show URL bar when tab is selected');
    expect(focusedURLBar(getCurrentPageId())).toEqual(
      true,
      'CREATE_TAB does focus URL bar when tab is selected');
  });

  it('Should create a new tab but not focus it if not selected', function() {
    const { getCurrentPageIndex, getCurrentPageId, showURLBar, focusedURLBar, dispatch } = this;
    dispatch(actions.createTab());
    dispatch(actions.setShowURLBar(getCurrentPageId(), false));
    dispatch(actions.setFocusedURLBar(getCurrentPageId(), false));

    dispatch(actions.createTab('https://github.com/', undefined, { selected: false }));

    expect(getCurrentPageIndex()).toEqual(
      0,
      'CREATE_TAB does not update `currentPageIndex` when creating a new tab but not selecting it');
    expect(showURLBar(getCurrentPageId())).toEqual(
      false,
      'CREATE_TAB does not show URL bar when tab is not selected');
    expect(focusedURLBar(getCurrentPageId())).toEqual(
      false,
      'CREATE_TAB does not focus URL bar when tab is not selected');
  });

  it('Should send a message to the main process', function() {
    const { dispatch } = this;

    const URL = `^${endpoints.UA_SERVICE_HTTP}`; // Observe leading caret ^ (caret)!
    fetchMock.mock(URL, 200);

    dispatch(actions.createTab('https://github.com/', 1234));

    expect(fetchMock.lastUrl(URL)).toEqual(`${endpoints.UA_SERVICE_HTTP}/sessions/start`);
    expect(fetchMock.lastOptions(URL).method).toEqual('POST');
    expect(fetchMock.lastOptions(URL).json)
      .toEqual({ ancestor: 1234, reason: undefined, scope: 0 });
  });
});
