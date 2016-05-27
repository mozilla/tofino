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

import path from 'path';
import electron from 'electron';

import * as hotkeys from './hotkeys';
import { UI_DIR, fileUrl } from '../shared/paths-util';
import BUILD_CONFIG from '../../build-config';

const BROWSER_CHROME_URL = fileUrl(path.join(UI_DIR, 'browser', 'browser.html'));
const BrowserWindow = electron.BrowserWindow;  // create native browser window.

/**
 * Top-level list of Browser Windows.
 * @TODO Is this still needed? Electron can return all of its browser windows.
 */

const browserWindows = [];

/**
 * Takes a UserAgentClient to create scopes and also takes an onload callback --
 * currently used for the first window created to record load times.
 */
export async function createBrowserWindow(userAgentClient, onload) {
  await userAgentClient.connect();
  // TODO: don't abuse the storage layer's session ID generation to produce scopes.
  const scope = await userAgentClient.startSession();

  // Create the browser window.
  const browser = new BrowserWindow({
    center: false,
    width: 1366,
    height: 768,
    minWidth: 512,
    minHeight: 128,
    frame: false,
    show: false,
  });
  browser.scope = scope;

  browser.webContents.once('did-finish-load', () => {
    if (onload) {
      onload();
    }
  });

  browser.once('window-ready', (error) => {
    // Show this BW (and a devtools window on error).
    if (!browser.isDestroyed()) {
      browser.show();
      if (BUILD_CONFIG.development && error) {
        browser.openDevTools({ detach: true });
      }
    }
  });

  // Start loading browser chrome.
  browser.loadURL(BROWSER_CHROME_URL);

  hotkeys.bindBrowserWindowHotkeys(browser);
  browser.once('closed', () => {
    hotkeys.unbindBrowserWindowHotkeys(browser);
  });

  browserWindows.push(browser);

  if (BUILD_CONFIG.development) {
    // In development, we'll always show the window and devtools immediately, rather than waiting
    // for 'window-ready' (in both success and error cases).  This leads to a bit of paint flicker,
    // but allows to debug index.jsx errors that prevent the onerror handling registering and
    // firing.  Such errors might include import and parse errors.
    browser.openDevTools({ detach: true });
    browser.show();
  }

  return browser;
}

export async function closeBrowserWindow(bw) {
  const index = browserWindows.indexOf(bw);
  if (index < 0) {
    return;
  }
  browserWindows.splice(index, 1);

  bw.close();
}

/**
 * Takes a function to be used as a handler for an ipc event,
 * and discards the event if we cannot identify a browser window
 * from which the event came. If successful, the handler is called with
 * the `BrowserWindow` instance rather than the `event` as the first argument.
 */
export function onlyWhenFromBrowserWindow(handler) {
  return function(event, ...args) {
    if (!event || !event.sender) {
      return;
    }

    const bw = BrowserWindow.fromWebContents(event.sender);

    if (!bw || bw.isDestroyed()) {
      return;
    }

    handler(bw, ...args);
  };
}
