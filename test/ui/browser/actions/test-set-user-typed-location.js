// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import 'babel-polyfill';
import 'babel-register';

import expect from 'expect';
import configureStore from '../../../../ui/browser/store/store';
import * as actions from '../../../../ui/browser/actions/main-actions';

describe('Action - SET_USER_TYPED_LOCATION', () => {
  beforeEach(function() {
    this.store = configureStore();
    this.getState = () => this.store.getState().browserWindow;
    this.dispatch = this.store.dispatch;

    const { dispatch } = this;
    dispatch(actions.createTab('http://moz1.org'));
    dispatch(actions.createTab('http://moz2.org'));
    dispatch(actions.createTab('http://moz3.org'));
    dispatch(actions.closeTab(0));
    dispatch(actions.setPageDetails({
      pageIndex: 0,
      title: 'moz1',
    }));
    dispatch(actions.setPageDetails({
      pageIndex: 1,
      title: 'moz2',
    }));
    dispatch(actions.setPageDetails({
      pageIndex: 2,
      title: 'moz3',
    }));
    dispatch(actions.setCurrentTab(0));
  });

  it('Should update page values', function() {
    const { dispatch, getState } = this;

    dispatch(actions.setUserTypedLocation({
      pageIndex: 1,
      text: 'Foo',
    }));
    expect(getState().pages.get(1).userTyped).toEqual('Foo');
  });

  it('Should do nothing if page does not exist', function() {
    const { dispatch, getState } = this;

    dispatch(actions.setUserTypedLocation({
      pageIndex: 10,
      title: 'Bar',
    }));
    expect(getState().pages.get(0).userTyped).toEqual(null);
    expect(getState().pages.get(1).userTyped).toEqual(null);
    expect(getState().pages.get(2).userTyped).toEqual(null);
  });
});
