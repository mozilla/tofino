/* @flow */

// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import fetchMock from 'fetch-mock';

import configureStore from '../../../../../app/ui/browser/store/store';
import * as actions from '../../../../../app/ui/browser/actions/main-actions';
import * as selectors from '../../../../../app/ui/browser/selectors';

import { HOME_PAGE } from '../../../../../app/ui/browser/constants/ui';
import * as endpoints from '../../../../../app/shared/constants/endpoints';

describe('Action - CREATE_TAB', () => {
  beforeEach(function() {
    this.store = configureStore();
    this.getPages = () => selectors.getPages(this.store.getState());
    this.getCurrentPageIndex = () => selectors.getCurrentPageIndex(this.store.getState());
    this.dispatch = this.store.dispatch;
  });

  afterEach(fetchMock.reset);

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

  it('Should send a message to the main process', function() {
    const { dispatch } = this;

    const URL = `^${endpoints.UA_SERVICE_HTTP}`; // Observe leading caret ^ (caret)!
    fetchMock.mock(URL, 200);

    dispatch(actions.createTab('https://github.com/', 1234));

    expect(fetchMock.lastUrl(URL)).toEqual(`${endpoints.UA_SERVICE_HTTP}/session/start`);
    expect(fetchMock.lastOptions(URL).method).toEqual('POST');
    expect(fetchMock.lastOptions(URL).json)
      .toEqual({ ancestor: 1234, reason: undefined, scope: 0 });
  });
});
