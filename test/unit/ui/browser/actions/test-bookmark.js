/* @flow */

// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import fetchMock from 'fetch-mock';

import { createBrowserStore } from '../../../../../app/ui/browser-blueprint/store';
import * as actions from '../../../../../app/ui/browser-blueprint/actions/main-actions';
import * as selectors from '../../../../../app/ui/browser-blueprint/selectors';
import * as utils from '../../../../utils/async';
import * as endpoints from '../../../../../app/shared/constants/endpoints';

describe('Action - bookmark', () => {
  const session = 1;

  beforeEach(function() {
    this.store = createBrowserStore();
    this.getProfile = () => selectors.getProfile(this.store.getState());
    this.getPages = () => selectors.getPages(this.store.getState());
    this.dispatch = this.store.dispatch;
    this.dispatch(actions.createTab('http://moz1.com'));
    expect(this.getPages().size).toEqual(1);

    // Set the session id directly since we don't have a UA server setting this
    this.dispatch(actions.setPageDetails(this.getPages().get(0).id, {
      sessionId: session,
    }));
  });

  afterEach(fetchMock.reset);
  after(fetchMock.restore);

  it('Should add bookmarks to profile state', function() {
    const { dispatch, getProfile, getPages } = this;
    const pageId = getPages().get(0).id;

    expect(getProfile().get('bookmarks').has('http://moz1.com')).toEqual(false);
    dispatch(actions.bookmark(pageId, 'http://moz1.com', 'moz1'));
    expect(getProfile().get('bookmarks').has('http://moz1.com')).toEqual(true);
  });

  it('Should send a message to the main process', async function() {
    const { dispatch, getPages } = this;
    const pageId = getPages().get(0).id;

    const URL = `^${endpoints.UA_SERVICE_HTTP}`; // Observe leading caret ^ (caret)!
    const expectedURL = `${endpoints.UA_SERVICE_HTTP}/stars/${encodeURIComponent('http://moz1.com')}`;

    fetchMock.mock(URL, 200);

    dispatch(actions.bookmark(pageId, 'http://moz1.com', 'moz1'));

    await utils.waitUntil(() => fetchMock.lastUrl(URL) === expectedURL);

    expect(fetchMock.lastUrl(URL)).toEqual(expectedURL);
    expect(fetchMock.lastOptions(URL).method).toEqual('PUT');
    expect(fetchMock.lastOptions(URL).json)
      .toEqual({ session, title: 'moz1' });
  });
});
