/* @flow */

// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import configureStore from '../../../../app/ui/browser/store/store';
import * as actions from '../../../../app/ui/browser/actions/main-actions';
import * as selectors from '../../../../app/ui/browser/selectors';

import fetchMock from 'fetch-mock';
import * as endpoints from '../../../../app/shared/constants/endpoints';

describe('Action - SET_USER_TYPED_LOCATION', () => {
  beforeEach(function() {
    this.store = configureStore();
    this.getPages = () => selectors.getPages(this.store.getState());
    this.getUserTypedLocation =
      pageId => selectors.getUserTypedLocation(this.store.getState(), pageId);
    this.dispatch = this.store.dispatch;

    const { dispatch } = this;
    dispatch(actions.createTab('http://moz1.org'));
    dispatch(actions.createTab('http://moz2.org'));
    dispatch(actions.createTab('http://moz3.org'));

    dispatch(actions.setPageDetails(this.getPages().get(0).id, {
      title: 'moz1',
    }));
    dispatch(actions.setPageDetails(this.getPages().get(1).id, {
      title: 'moz2',
    }));
    dispatch(actions.setPageDetails(this.getPages().get(2).id, {
      title: 'moz3',
    }));
    dispatch(actions.setCurrentTab(this.getPages().get(0).id));
  });

  it('Should update page values', function() {
    const { dispatch, getPages, getUserTypedLocation } = this;

    dispatch(actions.setUserTypedLocation(getPages().get(1).id, {
      text: 'Foo',
    }));
    expect(getUserTypedLocation(getPages().get(1).id)).toEqual('Foo');
  });

  it('Should send a message to the main process', function() {
    const { dispatch, getPages } = this;

    const URL = `^${endpoints.UA_SERVICE_HTTP}`; // Observe leading caret ^ (caret)!
    fetchMock.mock(URL, 200);

    dispatch(actions.setUserTypedLocation(getPages().get(1).id, {
      text: 'Bar',
    }));

    expect(fetchMock.lastUrl(URL))
      .toEqual(`${endpoints.UA_SERVICE_HTTP}/visits?q=${encodeURIComponent('Bar')}`);
    expect(fetchMock.lastOptions(URL).method).toEqual('GET');
  });
});
