/*
Copyright 2016 Mozilla

Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed
under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
CONDITIONS OF ANY KIND, either express or implied. See the License for the
specific language governing permissions and limitations under the License.
*/

import { call, race, take } from 'redux-saga/effects';

import { takeLatestMultiple } from './helpers';
import { remote, ipcRenderer } from '../../../shared/electron';
import * as EffectTypes from '../constants/effect-types';

export default function*() {
  yield takeLatestMultiple(
    [EffectTypes.MINIMIZE_WINDOW, minimizeWindow],
    [EffectTypes.MAXIMIZE_WINDOW, maximizeWindow],
    [EffectTypes.CLOSE_WINDOW, closeWindow],
    [EffectTypes.RELOAD_WINDOW, reloadWindow],
    [EffectTypes.OPEN_APP_MENU, openAppMenu],
  );
}

function* minimizeWindow() {
  const win = yield call(remote.getCurrentWindow);
  yield call(win.minimize);
}

function* maximizeWindow() {
  const win = yield call(remote.getCurrentWindow);
  if (yield call(win.isMaximized)) {
    yield call(win.unmaximize);
  } else {
    yield call(win.maximize);
  }
}

function* closeWindow() {
  // Wait for any additional operations to finish before closing the window.
  // Add your own here if needed.
  yield race([
    take(EffectTypes.NOTIFY_BROWSER_WINDOW_APP_STATE_DESTROYED),
    take(EffectTypes.NOTIFY_BROWSER_WINDOW_APP_STATE_NOT_WATCHED),
  ]);
  yield call(ipcRenderer.send, 'close-browser-window');
}

function* reloadWindow() {
  // Wait for any additional operations to finish before reloading the window.
  // Add your own here if needed.
  yield race([
    take(EffectTypes.NOTIFY_BROWSER_WINDOW_APP_STATE_SAVED),
    take(EffectTypes.NOTIFY_BROWSER_WINDOW_APP_STATE_NOT_WATCHED),
  ]);
  yield call(ipcRenderer.send, 'reload-browser-window');
}

function* openAppMenu() {
  yield call(ipcRenderer.send, 'open-menu');
}
