// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import configureStore from '../../../../app/ui/browser/store/store';
import * as actions from '../../../../app/ui/browser/actions/main-actions';
import * as profileCommandTypes from '../../../../app/shared/constants/profile-command-types';
import * as selectors from '../../../../app/ui/browser/selectors';
import { ipcMain as ipcMainMock } from '../../../../app/shared/electron';

describe('Action - SET_USER_TYPED_LOCATION', () => {
  beforeEach(function() {
    this.store = configureStore();
    this.getPages = () => selectors.getPages(this.store.getState());
    this.dispatch = this.store.dispatch;

    const { dispatch } = this;
    dispatch(actions.createTab('http://moz1.org'));
    dispatch(actions.createTab('http://moz2.org'));
    dispatch(actions.createTab('http://moz3.org'));

    dispatch(actions.closeTab(this.getPages().get(0).id));

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
    const { dispatch, getPages } = this;

    dispatch(actions.setUserTypedLocation(getPages().get(1).id, {
      text: 'Foo',
    }));
    expect(getPages().get(1).userTyped).toEqual('Foo');
  });

  it('Should send a message to the main process', function(done) {
    const { dispatch, getPages } = this;

    ipcMainMock.on('profile-command', handleIpc);

    dispatch(actions.setUserTypedLocation(getPages().get(1).id, {
      text: 'Bar',
    }));

    function handleIpc(e, ...args) {
      // Filter out any mock ipc calls that are not yet guaranteed to have
      // completed
      if (args[0].type !== profileCommandTypes.DID_SET_USER_TYPED_LOCATION ||
          args[0].payload.text !== 'Bar') {
        return;
      }
      expect(args[0].type).toEqual(profileCommandTypes.DID_SET_USER_TYPED_LOCATION);
      expect(args[0].payload.text).toEqual('Bar');
      ipcMainMock.removeListener('profile-command', handleIpc);
      done();
    }
  });
});
