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

import { default as electron, ipcMain } from 'electron';
import shortcut from 'electron-localshortcut';

/**
 * Mapping of accelerators to a function that takes a BrowserWindow,
 * and returns the handler for that window when the accelerator
 * is fired.
 */
const HOTKEYS = new Map([
  ['CmdOrCtrl+Shift+W', bw => () => bw.webContents.send('close-window')],
  ['CmdOrCtrl+L', bw => () => bw.webContents.send('focus-url-bar')],
  ['CmdOrCtrl+R', bw => () => bw.webContents.send('page-refresh')],
  ['CmdOrCtrl+Shift+R', bw => () => bw.webContents.send('page-refresh', { ignoreCache: true })],
  ['CmdOrCtrl+1', bw => () => bw.webContents.send('select-tab-index', 0)],
  ['CmdOrCtrl+2', bw => () => bw.webContents.send('select-tab-index', 1)],
  ['CmdOrCtrl+3', bw => () => bw.webContents.send('select-tab-index', 2)],
  ['CmdOrCtrl+4', bw => () => bw.webContents.send('select-tab-index', 3)],
  ['CmdOrCtrl+5', bw => () => bw.webContents.send('select-tab-index', 4)],
  ['CmdOrCtrl+6', bw => () => bw.webContents.send('select-tab-index', 5)],
  ['CmdOrCtrl+7', bw => () => bw.webContents.send('select-tab-index', 6)],
  ['CmdOrCtrl+8', bw => () => bw.webContents.send('select-tab-index', 7)],
  ['CmdOrCtrl+9', bw => () => bw.webContents.send('select-tab-last')],
  ['CmdOrCtrl+Shift+[', bw => () => bw.webContents.send('select-tab-previous')],
  ['CmdOrCtrl+Shift+]', bw => () => bw.webContents.send('select-tab-next')],
  ['CmdOrCtrl+Alt+Left', bw => () => bw.webContents.send('select-tab-previous')],
  ['CmdOrCtrl+Alt+Right', bw => () => bw.webContents.send('select-tab-next')],
  ['Ctrl+Shift+Tab', bw => () => bw.webContents.send('select-tab-previous')],
  ['Ctrl+Tab', bw => () => bw.webContents.send('select-tab-next')],
  ['CmdOrCtrl+F', bw => () => bw.webContents.send('show-page-search')],
  ['CmdOrCtrl+=', bw => () => bw.webContents.send('zoom-in')],
  ['CmdOrCtrl+-', bw => () => bw.webContents.send('zoom-out')],
  ['CmdOrCtrl+0', bw => () => bw.webContents.send('zoom-reset')],
]);

const CUSTOM_HANDLED_HOTKEYS = new Map([
  ['CmdOrCtrl+Left', bw => () => bw.webContents.send('go-back')],
  ['CmdOrCtrl+Right', bw => () => bw.webContents.send('go-forward')],
]);

const handlerSet = new Set();

export function bindBrowserWindowHotkeys(browserWindow) {
  const handler = handleGuestActiveElementChange.bind(null, browserWindow);
  handlerSet.add(handler);
  ipcMain.on('guest-active-element', handler);

  HOTKEYS.forEach((handlerFactory, accelerator) => {
    shortcut.register(browserWindow, accelerator, handlerFactory(browserWindow));
  });
}

export function unbindBrowserWindowHotkeys(browserWindow) {
  handlerSet.forEach(handler => ipcMain.removeListener('guest-active-element', handler));
  shortcut.unregisterAll(browserWindow);
}

// Registered shortcuts swallow the default event from happening even when they
// don't do anything. So if CmdOrCtrl+Left/Right is bound, even if the handler
// would do nothing, there won't be action happening in a focused input element.
// Sadly, we need to disable/enable these shortcuts based on the active element.
function handleGuestActiveElementChange(browserWindow, event, { details }) {
  if (!details || details.nodeName !== 'INPUT') {
    CUSTOM_HANDLED_HOTKEYS.forEach((handlerFactory, accelerator) => {
      shortcut.register(browserWindow, accelerator, handlerFactory(browserWindow));
    });
  } else {
    CUSTOM_HANDLED_HOTKEYS.forEach((_, accelerator) => {
      shortcut.unregister(browserWindow, accelerator);
    });
  }
}

/**
 * To be used in responding to IPC 'synthesize-accelerator' messages, by looking
 * through hotkeys defined and firing the message to the active browser window if found.
 *
 * Does not analyze the accelerator for the 'true' command used, for example,
 * it just crudely maps "CmdOrCtrl+T" to "CmdOrCtrl+T" -- it would not match
 * "CommandOrControl+T" or "Command+T" on OSX, etc. This is fine as we're just using these
 * in tests.
 *
 * @see `./app/main/menu/index.js` as well for handling synthesized menu hotkeys.
 *
 * Current should only be used in tests.
 */
export function handleIPCAcceleratorCommand(e, accelerator) {
  const focused = electron.BrowserWindow.getFocusedWindow();
  const handlerFactory = HOTKEYS.get(accelerator);

  if (!focused || !handlerFactory) {
    return;
  }

  // Execute the handler
  handlerFactory(focused)();
}
