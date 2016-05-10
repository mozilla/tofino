/* @flow */

// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import configureStore from '../../../../app/ui/browser/store/store';
import * as actions from '../../../../app/ui/browser/actions/main-actions';
import * as selectors from '../../../../app/ui/browser/selectors';

import fetchMock from 'fetch-mock';

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

    fetchMock
      .mock('^http://localhost:9090/stars', 200);

    dispatch(actions.bookmark(session, 'http://moz1.com', 'moz1'));

    expect(fetchMock.lastUrl('^http://localhost:9090/stars'))
      .toEqual(`http://localhost:9090/stars/${encodeURIComponent('http://moz1.com')}`);
    expect(fetchMock.lastOptions('^http://localhost:9090/stars').method).toEqual('PUT');
    expect(fetchMock.lastOptions('^http://localhost:9090/stars').json)
      .toEqual({ session, title: 'moz1' });
  });
});
