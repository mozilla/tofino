/* @flow */

// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import configureStore from '../../../../app/ui/browser/store/store';
import * as actions from '../../../../app/ui/browser/actions/main-actions';
import * as selectors from '../../../../app/ui/browser/selectors';
import { ipcMain as ipcMainMock } from '../../../../app/shared/electron';
import * as profileCommandTypes from '../../../../app/shared/constants/profile-command-types';

describe('Action - CLOSE_TAB', () => {
  beforeEach(function() {
    this.store = configureStore();
    this.getPages = () => selectors.getPages(this.store.getState());
    this.getCurrentPageIndex = () => selectors.getCurrentPageIndex(this.store.getState());
    this.dispatch = this.store.dispatch;

    const { getCurrentPageIndex, getPages, dispatch } = this;
    dispatch(actions.createTab());
    dispatch(actions.createTab('https://moz.org/1'));
    dispatch(actions.createTab('https://moz.org/2'));
    dispatch(actions.createTab('https://moz.org/3'));
    expect(getCurrentPageIndex()).toEqual(3);
    expect(getPages().size).toEqual(4);
  });

  it('Should maintain tab selection when destroying a tab before the selected tab', function() {
    const { getCurrentPageIndex, getPages, dispatch } = this;
    const ids = getPages().map(p => p.id);

    // Fake session ID for first tab, and make last tab a descendant of the first tab.
    dispatch(actions.didStartSession(getPages().get(0).id, 11));
    dispatch(actions.didStartSession(getPages().get(1).id, 22, 11));

    dispatch(actions.closeTab(ids.get(1)));
    expect(getPages().size).toEqual(3);
    expect(getPages().get(0).location).toEqual('tofino://mozilla');
    expect(getPages().get(1).location).toEqual('https://moz.org/2');
    expect(getPages().get(2).location).toEqual('https://moz.org/3');
    expect(getCurrentPageIndex()).toEqual(2,
      'CLOSE_TAB does not update selected tab if the tab destroyed was not selected.');
  });

  it('Should maintain tab selection when destroying a tab after the selected tab', function() {
    const { getCurrentPageIndex, getPages, dispatch } = this;
    const ids = getPages().map(p => p.id);

    // Fake session ID for first tab, and make last tab a descendant of the first tab.
    dispatch(actions.didStartSession(getPages().get(0).id, 11));
    dispatch(actions.didStartSession(getPages().get(3).id, 22, 11));

    dispatch(actions.setCurrentTab(ids.get(1)));
    dispatch(actions.closeTab(ids.get(3)));

    expect(getPages().size).toEqual(3);
    expect(getPages().get(1).location).toEqual('https://moz.org/1');
    expect(getCurrentPageIndex()).toEqual(1,
      'CLOSE_TAB does not update selected tab if the tab destroyed was not selected.');
  });

  it('Should destroy a selected tab and select next when it is not last tab' +
     ' and has no ancestor', function() {
    const { getCurrentPageIndex, getPages, dispatch } = this;
    const ids = getPages().map(p => p.id);

    expect(getPages().get(1).ancestorId).toNotExist();

    dispatch(actions.setCurrentTab(ids.get(1)));
    dispatch(actions.closeTab(ids.get(1)));

    expect(getPages().size).toEqual(3);
    expect(getPages().get(1).location).toEqual('https://moz.org/2');
    expect(getCurrentPageIndex()).toEqual(1,
      'CLOSE_TAB on selected tab selects the next tab');
  });

  it('Should destroy a selected tab and select previous when it is the last tab' +
     ' and has no ancestor', function() {
    const { getCurrentPageIndex, getPages, dispatch } = this;
    const ids = getPages().map(p => p.id);

    expect(getPages().get(3).ancestorId).toNotExist();
    dispatch(actions.closeTab(ids.get(3)));

    expect(getPages().size).toEqual(3);
    expect(getPages().get(2).location).toEqual('https://moz.org/2');
    expect(getCurrentPageIndex()).toEqual(2,
      'CLOSE_TAB on last selected tab selects the previous tab');
  });

  it('Should destroy a selected tab and select ancestor when it has an ancestor', function() {
    const { getCurrentPageIndex, getPages, dispatch } = this;
    const ids = getPages().map(p => p.id);

    // Fake session ID for first tab, and make last tab a descendant of the first tab.
    dispatch(actions.didStartSession(getPages().get(0).id, 11));
    dispatch(actions.didStartSession(getPages().get(3).id, 22, 11));

    dispatch(actions.closeTab(ids.get(3)));
    expect(getPages().size).toEqual(3);
    expect(getPages().get(2).location).toEqual('https://moz.org/2');
    expect(getCurrentPageIndex()).toEqual(0,
                                          'CLOSE_TAB on selected tab with ancestor selects the' +
                                          ' ancestor tab');
  });

  it('Destroying the last tab should close the tab and create a new tab', function() {
    const { getCurrentPageIndex, getPages, dispatch } = this;
    const ids = getPages().map(p => p.id);
    dispatch(actions.closeTab(ids.get(3)));
    dispatch(actions.closeTab(ids.get(2)));
    dispatch(actions.closeTab(ids.get(1)));
    expect(getCurrentPageIndex()).toEqual(0);
    expect(getPages().size).toEqual(1);

    dispatch(actions.closeTab(ids.get(0)));
    expect(getCurrentPageIndex()).toEqual(0);
    expect(getPages().size).toEqual(1);
    expect(getPages().get(0).location).toEqual('tofino://mozilla');
  });

  it('Should send a message to the main process', function(done) {
    const { dispatch, getPages } = this;

    // Fake session ID for first tab, and make second tab a descendant of the first tab.
    dispatch(actions.didStartSession(getPages().get(0).id, 11));
    dispatch(actions.didStartSession(getPages().get(1).id, 22, 11));

    ipcMainMock.on('profile-command', handleIpc);

    dispatch(actions.closeTab(getPages().get(1).id));

    function handleIpc(e, { command }) {
      // Filter out any mock ipc calls that are not yet guaranteed to have
      // completed
      if (command.type !== profileCommandTypes.DID_END_SESSION) {
        return;
      }
      expect(command.payload.sessionId).toEqual(22);
      ipcMainMock.removeListener('profile-command', handleIpc);
      done();
    }
  });
});
