/* @flow */

// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import configureStore from '../../../../app/ui/browser/store/store';
import * as actions from '../../../../app/ui/browser/actions/main-actions';
import * as selectors from '../../../../app/ui/browser/selectors';
import { ipcMain as ipcMainMock } from '../../../../app/shared/electron';
import * as profileCommandTypes from '../../../../app/shared/constants/profile-command-types';

const HOME_PAGE = 'tofino://mozilla';

describe('Action - CREATE_TAB', () => {
  beforeEach(function() {
    this.store = configureStore();
    this.getPages = () => selectors.getPages(this.store.getState());
    this.getCurrentPageIndex = () => selectors.getCurrentPageIndex(this.store.getState());
    this.dispatch = this.store.dispatch;
  });

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

  it('Should send a message to the main process', function(done) {
    const { dispatch } = this;

    ipcMainMock.on('profile-command', handleIpc);

    dispatch(actions.createTab('https://github.com/', 1234));

    function handleIpc(e, { command }) {
      // Filter out any mock ipc calls that are not yet guaranteed to have
      // completed.  We see bleed-through in this test.
      if (command.type !== profileCommandTypes.DID_START_SESSION || !command.payload.ancestorId) {
        return;
      }
      expect(command.payload.ancestorId).toEqual(1234);
      ipcMainMock.removeListener('profile-command', handleIpc);
      done();
    }
  });
});
