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

import { call, apply, race, take } from 'redux-saga/effects';

import { takeLatestMultiple } from '../../shared/util/saga-util';
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

// The `minimize`, `maximize`, `unmaximize` etc. methods on a remote window
// instance are, in fact, proxies which don't play nice with saga effects
// sent to the middleware via `call` or `apply`. For ease of testing,
// write simple wrappers around those methods.
const minimze = win => win.minimize();
const maximize = win => win.maximize();
const unmaximize = win => win.unmaximize();
const isMaximized = win => win.isMaximized();

function* minimizeWindow() {
  const win = yield apply(remote, remote.getCurrentWindow);
  yield call(minimze, win);
}

function* maximizeWindow() {
  const win = yield apply(remote, remote.getCurrentWindow);
  if (yield call(isMaximized, win)) {
    yield call(unmaximize, win);
  } else {
    yield call(maximize, win);
  }
}

function* closeWindow() {
  // Wait for any additional operations to finish before closing the window.
  // Add your own here if needed.
  yield race([
    take(EffectTypes.NOTIFY_BROWSER_WINDOW_APP_STATE_DESTROYED),
    take(EffectTypes.NOTIFY_BROWSER_WINDOW_APP_STATE_NOT_WATCHED),
  ]);
  yield apply(ipcRenderer, ipcRenderer.send, ['close-browser-window']);
}

function* reloadWindow() {
  // Wait for any additional operations to finish before reloading the window.
  // Add your own here if needed.
  yield race([
    take(EffectTypes.NOTIFY_BROWSER_WINDOW_APP_STATE_SAVED),
    take(EffectTypes.NOTIFY_BROWSER_WINDOW_APP_STATE_NOT_WATCHED),
  ]);
  yield apply(ipcRenderer, ipcRenderer.send, ['reload-browser-window']);
}

function* openAppMenu() {
  yield apply(ipcRenderer, ipcRenderer.send, ['open-menu']);
}
