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

/**
 * The Electron main process does not receive many HTML5 events, including
 * online and offline status changes.  The recommended approach is to
 * pass-through the HTML5 events from a content process to the main process: see
 * https://github.com/electron/electron/blob/master/docs/tutorial/online-offline-events.md.
 *
 * We implement this approach here in a single, extensible place.  We maintain a
 * single hidden background content renderer, pass-through events, and expose an
 * event emitter and simple API.
 */

import { app, BrowserWindow, ipcMain } from 'electron';
import { EventEmitter } from 'events';
const HIDDEN_WINDOW_URL = `file://${__dirname}/hidden-window/index.html`;

class HiddenWindow extends EventEmitter {
  constructor() {
    super();

    this._handleOnlineStatusChanged = this._handleOnlineStatusChanged.bind(this);
  }

  get isOnline() {
    return this._isOnline;
  }

  _register() {
    this._window = new BrowserWindow({ width: 0, height: 0, show: false });
    this._window.loadURL(HIDDEN_WINDOW_URL);
    ipcMain.on('hidden-window:online-status-changed', this._handleOnlineStatusChanged);
  }

  _handleOnlineStatusChanged(_, isOnline) {
    this.emit('online-status-changed', isOnline);
    this._isOnline = isOnline;
  }
}

const hiddenWindow = new HiddenWindow();

app.on('ready', () => hiddenWindow._register());

export default hiddenWindow;
