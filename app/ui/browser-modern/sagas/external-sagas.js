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

import { takeLatest } from 'redux-saga';
import { take } from 'redux-saga/effects';

import { wrapped } from './helpers';
import { remote, ipcRenderer } from '../../../shared/electron';
import * as EffectTypes from '../constants/effect-types';

export default function*() {
  yield [
    takeLatest(...wrapped(EffectTypes.MINIMIZE_WINDOW, minimizeWindow)),
    takeLatest(...wrapped(EffectTypes.MAXIMIZE_WINDOW, maximizeWindow)),
    takeLatest(...wrapped(EffectTypes.CLOSE_WINDOW, closeWindow)),
    takeLatest(...wrapped(EffectTypes.RELOAD_WINDOW, reloadWindow)),
    takeLatest(...wrapped(EffectTypes.OPEN_APP_MENU, openAppMenu)),
  ];
}

function* minimizeWindow() {
  remote.getCurrentWindow().minimize();
}

function* maximizeWindow() {
  const win = remote.getCurrentWindow();
  if (win.isMaximized()) {
    win.unmaximize();
  } else {
    win.maximize();
  }
}

function* closeWindow() {
  // Wait for any additional operations to finish before closing the window.
  // Add your own here if needed.
  yield take(EffectTypes.NOTIFY_BROWSER_WINDOW_APP_STATE_DESTROYED);
  ipcRenderer.send('close-browser-window');
}

function* reloadWindow() {
  const win = remote.getCurrentWindow();
  win.reload();
}

function* openAppMenu() {
  ipcRenderer.send('open-menu');
}
