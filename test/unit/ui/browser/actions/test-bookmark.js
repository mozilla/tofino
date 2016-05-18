/* @flow */

// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import configureStore from '../../../../../app/ui/browser/store/store';
import * as actions from '../../../../../app/ui/browser/actions/main-actions';
import * as selectors from '../../../../../app/ui/browser/selectors';

import fetchMock from 'fetch-mock';
import * as endpoints from '../../../../../app/shared/constants/endpoints';

describe('Action - bookmark', () => {
  const session = 1;

  beforeEach(function() {
    this.store = configureStore();
    this.getProfile = () => selectors.getProfile(this.store.getState());
    this.dispatch = this.store.dispatch;
  });

  afterEach(fetchMock.reset);

  it('Should add bookmarks to profile state', function() {
    const { dispatch, getProfile } = this;

    expect(getProfile().get('bookmarks').has('http://moz1.com')).toEqual(false);
    dispatch(actions.bookmark(session, 'http://moz1.com', 'moz1'));
    expect(getProfile().get('bookmarks').has('http://moz1.com')).toEqual(true);
  });

  it('Should send a message to the main process', function() {
    const { dispatch } = this;

    const URL = `^${endpoints.UA_SERVICE_HTTP}`; // Observe leading caret ^ (caret)!
    fetchMock.mock(URL, 200);

    dispatch(actions.bookmark(session, 'http://moz1.com', 'moz1'));

    expect(fetchMock.lastUrl(URL))
      .toEqual(`${endpoints.UA_SERVICE_HTTP}/stars/${encodeURIComponent('http://moz1.com')}`);
    expect(fetchMock.lastOptions(URL).method).toEqual('PUT');
    expect(fetchMock.lastOptions(URL).json)
      .toEqual({ session, title: 'moz1' });
  });
});
