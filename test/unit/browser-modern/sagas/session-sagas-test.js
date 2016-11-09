// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';

import { takeLatest } from 'redux-saga';
import { apply } from 'redux-saga/effects';
import main, * as SessionSagas from '../../../../app/ui/browser-modern/sagas/session-sagas';
import * as EffectTypes from '../../../../app/ui/browser-modern/constants/effect-types';
import { ipcRenderer } from '../../../../app/shared/electron';

describe('session sagas', () => {
  it('should listen to the appropriate actions', () => {
    const gen = main();
    expect(gen.next().value.meta).toEqual({
      type: takeLatest,
      patterns: [
        [EffectTypes.SET_SESSION_KEY, SessionSagas.setSessionKey],
        [EffectTypes.DELETE_SESSION_KEY, SessionSagas.deleteSessionKey],
        [EffectTypes.RELOAD_WINDOW, SessionSagas.handleWillReloadWindowAction],
        [EffectTypes.CLOSE_WINDOW, SessionSagas.handleWillCloseWindowAction],
        [EffectTypes.START_SAVING_BROWSER_WINDOW_APP_STATE,
          SessionSagas.startSavingBrowserWindowAppState],
        [EffectTypes.STOP_SAVING_BROWSER_WINDOW_APP_STATE,
          SessionSagas.stopSavingBrowserWindowAppState],
        [EffectTypes.SESSION_RESTORE_BROWSER_WINDOW_APP_STATE,
          SessionSagas.restoreBrowserWindowAppState],
      ],
    });
    expect(gen.next().done).toEqual(true);
  });

  it('should be able to set a session key', () => {
    const payload = {
      key: 'foo',
      value: 'bar',
    };
    const gen = SessionSagas.setSessionKey(payload);
    expect(gen.next().value).toEqual(
      apply(ipcRenderer, ipcRenderer.send, ['session-set-key', payload.key, payload.value]));

    expect(gen.next().done).toEqual(true);
  });

  it('should be able to delete a session key', () => {
    const payload = {
      key: 'foo',
    };
    const gen = SessionSagas.deleteSessionKey(payload);
    expect(gen.next().value).toEqual(
      apply(ipcRenderer, ipcRenderer.send, ['session-delete-key', payload.key]));

    expect(gen.next().done).toEqual(true);
  });
});
