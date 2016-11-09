// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';

import { takeLatest } from 'redux-saga';
import { apply, call, race, take } from 'redux-saga/effects';
import main, * as WindowSagas from '../../../../app/ui/browser-modern/sagas/window-sagas';
import * as EffectTypes from '../../../../app/ui/browser-modern/constants/effect-types';
import { remote, ipcRenderer } from '../../../../app/shared/electron';

describe('window sagas', () => {
  it('should listen to the appropriate actions', () => {
    const gen = main();
    expect(gen.next().value.meta).toEqual({
      type: takeLatest,
      patterns: [
        [EffectTypes.MINIMIZE_WINDOW, WindowSagas.minimizeWindow],
        [EffectTypes.MAXIMIZE_WINDOW, WindowSagas.maximizeWindow],
        [EffectTypes.CLOSE_WINDOW, WindowSagas.closeWindow],
        [EffectTypes.RELOAD_WINDOW, WindowSagas.reloadWindow],
        [EffectTypes.OPEN_APP_MENU, WindowSagas.openAppMenu],
      ],
    });
    expect(gen.next().done).toEqual(true);
  });

  it('should be able to minimize the window', () => {
    const gen = WindowSagas.minimizeWindow();
    const win = {};
    expect(gen.next().value).toEqual(apply(remote, remote.getCurrentWindow));
    expect(gen.next(win).value).toEqual(call(WindowSagas.minimize, win));
    expect(gen.next().done).toEqual(true);
  });

  it('should be able to maximize the window when not maximized', () => {
    const gen = WindowSagas.maximizeWindow();
    const win = {};
    const isMaximized = false;
    expect(gen.next().value).toEqual(apply(remote, remote.getCurrentWindow));
    expect(gen.next(win).value).toEqual(call(WindowSagas.isMaximized, win));
    expect(gen.next(isMaximized).value).toEqual(call(WindowSagas.maximize, win));
    expect(gen.next().done).toEqual(true);
  });

  it('should be able to unmaximize the window when already maximized', () => {
    const gen = WindowSagas.maximizeWindow();
    const win = {};
    const isMaximized = true;
    expect(gen.next().value).toEqual(apply(remote, remote.getCurrentWindow));
    expect(gen.next(win).value).toEqual(call(WindowSagas.isMaximized, win));
    expect(gen.next(isMaximized).value).toEqual(call(WindowSagas.unmaximize, win));
    expect(gen.next().done).toEqual(true);
  });

  it('should be able to close a window when ready', () => {
    const gen = WindowSagas.closeWindow();
    const win = {};
    expect(gen.next().value).toEqual(race([
      take(EffectTypes.NOTIFY_BROWSER_WINDOW_APP_STATE_DESTROYED),
      take(EffectTypes.NOTIFY_BROWSER_WINDOW_APP_STATE_NOT_WATCHED),
    ]));
    expect(gen.next(win).value).toEqual(apply(ipcRenderer, ipcRenderer.send, ['close-browser-window']));
    expect(gen.next().done).toEqual(true);
  });

  it('should be able to reload a window when ready', () => {
    const gen = WindowSagas.reloadWindow();
    const win = {};
    expect(gen.next().value).toEqual(race([
      take(EffectTypes.NOTIFY_BROWSER_WINDOW_APP_STATE_SAVED),
      take(EffectTypes.NOTIFY_BROWSER_WINDOW_APP_STATE_NOT_WATCHED),
    ]));
    expect(gen.next(win).value).toEqual(apply(ipcRenderer, ipcRenderer.send, ['reload-browser-window']));
    expect(gen.next().done).toEqual(true);
  });
});
