// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import configureStore from '../../../../app/ui/browser/store/store';
import * as actions from '../../../../app/ui/browser/actions/main-actions';
import * as profileConstants from '../../../../app/shared/constants/profile-command-types';
import { ipcMain as ipcMainMock } from '../../../../app/shared/electron';

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

  it('Should send a message to the main process', function(done) {
    const { dispatch } = this;

    ipcMainMock.on('profile-command', handleIpc);

    dispatch(actions.setUserTypedLocation({
      pageIndex: 1,
      text: 'Bar',
    }));

    function handleIpc(e, ...args) {
      // Filter out any mock ipc calls that are not yet guaranteed to have
      // completed
      if (args[0].type !== profileConstants.SET_USER_TYPED_LOCATION ||
          args[0].payload.text !== 'Bar') {
        return;
      }
      expect(args[0].type).toEqual(profileConstants.SET_USER_TYPED_LOCATION);
      expect(args[0].payload.text).toEqual('Bar');
      ipcMainMock.removeListener('profile-command', handleIpc);
      done();
    }
  });
});
