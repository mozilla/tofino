/* @flow */

// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import configureStore from '../../../../app/ui/browser/store/store';
import * as actions from '../../../../app/ui/browser/actions/main-actions';

import fetchMock from 'fetch-mock';

describe('Action - unbookmark', () => {
  const session = 1;

  beforeEach(function() {
    this.store = configureStore();
    this.getState = () => this.store.getState().profile;
    this.dispatch = this.store.dispatch;
  });

  afterEach(fetchMock.reset);

  it('Should remove bookmarks from profile state', function() {
    const { dispatch, getState } = this;

    expect(getState().get('bookmarks').has('http://moz1.com')).toEqual(false);
    dispatch(actions.bookmark(session, 'http://moz1.com', 'moz1'));
    expect(getState().get('bookmarks').has('http://moz1.com')).toEqual(true);
    dispatch(actions.unbookmark(session, 'http://moz1.com'));
    expect(getState().get('bookmarks').has('http://moz1.com')).toEqual(false);
  });

  it('Should send a message to the main process', function() {
    const { dispatch } = this;

    fetchMock
      .mock('^http://localhost:9090/stars', 200);

    dispatch(actions.bookmark(session, 'http://moz1.com', 'moz1'));
    dispatch(actions.unbookmark(session, 'http://moz1.com'));

    expect(fetchMock.lastUrl('^http://localhost:9090/stars'))
      .toEqual(`http://localhost:9090/stars/${encodeURIComponent('http://moz1.com')}`);
    expect(fetchMock.lastOptions('^http://localhost:9090/stars').method).toEqual('DELETE');
    expect(fetchMock.lastOptions('^http://localhost:9090/stars').json)
      .toEqual({ session });
  });
});
