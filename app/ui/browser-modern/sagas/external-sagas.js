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

import { wrapped } from './helpers';
import { remote, ipcRenderer } from '../../../shared/electron';
import * as EffectTypes from '../constants/effect-types';

export default function() {
  return [
    function*() {
      yield* takeLatest(...wrapped(EffectTypes.MINIMIZE_WINDOW, minimizeWindow));
    },
    function*() {
      yield* takeLatest(...wrapped(EffectTypes.MAXIMIZE_WINDOW, maximizeWindow));
    },
    function*() {
      yield* takeLatest(...wrapped(EffectTypes.CLOSE_WINDOW, closeWindow));
    },
    function*() {
      yield* takeLatest(...wrapped(EffectTypes.OPEN_APP_MENU, openAppMenu));
    },
  ];
}

function* minimizeWindow() {
  remote.getCurrentWindow().minimize();
}

function* maximizeWindow() {
  if (remote.getCurrentWindow()) {
    remote.getCurrentWindow().maximize();
  } else {
    remote.unmaximize();
  }
}

function* closeWindow() {
  ipcRenderer.send('close-browser-window');
}

function* openAppMenu() {
  ipcRenderer.send('open-menu');
}
