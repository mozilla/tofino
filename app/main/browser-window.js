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
/* global LIBDIR */

import path from 'path';
import uuid from 'uuid';
import { BrowserWindow } from 'electron';

import Deferred from '../shared/deferred';
import * as hotkeys from './hotkeys';
import * as downloads from './downloads';
import * as protocols from './protocols';
import * as state from './state';
import { logger } from '../shared/logging';
import { fileUrl } from './paths-util';
import { getSessionKey } from './session-io';
import BUILD_CONFIG from '../build-config';

// Switch to 'browser-modern' or 'browser-alt' to test different frontends.
// We should have a flag to the application to switch frontends
const UI_DIR = path.join(LIBDIR, 'ui');
const BROWSER_CHROME_URL = fileUrl(path.join(UI_DIR, 'browser-modern', 'browser.html'));

/**
 * Top-level list of Browser Windows.
 * @TODO Is this still needed? Electron can return all of its browser windows.
 */

const browserWindows = [];

/**
 * Map of BrowserWindow instances to promises indicating their load state -- resolves
 * when BW is fully loaded.
 */
const browserWindowLoaded = new Map();

/**
 * Takes a URL and attempts to open it in a window and focus it, or create a new window.
 * Waits until app is finished initializing.
 */
export async function focusOrOpenWindow(url) {
  await state.INITIALIZED;

  let bw = BrowserWindow.getFocusedWindow();
  if (!bw) {
    bw = BrowserWindow.getAllWindows()[0];
    if (bw) {
      if (bw.isMinimized()) {
        bw.restore();
      }
      bw.focus();
    }
  }

  if (!bw) {
    bw = await createBrowserWindow();
  } else if (url) {
    await browserWindowLoaded.get(bw);
  }

  bw.webContents.send('new-tab', url);
}

/**
 * Creates a new browser window for the browser chrome, and returns a promise
 * that resolves upon initialization. Takes an optional url to load in the window.
 */
export async function createBrowserWindow({ windowId, appState } = {}) {
  // TODO: don't abuse the storage layer's session ID generation to produce scopes.
  // Await for `startSession()` here since that ensures we have a connection to
  // the UA service at this point.
  const scope = await state.userAgentClient.startSession();

  // Get the UA service address information from the user agent client
  // after it has negotiated a connection so we can send it to the client.
  const { port, host, version } = state.userAgentClient.connectionDetails();

  if (!port || !host || !version) {
    throw new Error('The host, port, and version must be defined after connecting.');
  }

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
  browser.windowId = windowId || uuid.v4();

  browser.webContents.once('did-finish-load', () => {
    // The client needs to know where the UA service is in order to connect
    // to it, and subsequently fire its 'window-ready' event.
    browser.webContents.send('user-agent-service-info', { port, host, version });
    browser.webContents.send('window-id', browser.windowId);
  });

  // Only check and send the set default browser message if this is the first
  // window opened, we're in a build that offers (~= non-development), running
  // on OSX (for now), and this isn't already the default browser.
  const shouldAskToSetDefaultBrowser = browserWindows.length === 0 &&
                                       BUILD_CONFIG.offerDefault &&
                                       BUILD_CONFIG.platform === 'darwin' &&
                                       !protocols.isDefaultBrowser();

  const readyDeferred = new Deferred();
  browserWindowLoaded.set(browser, readyDeferred.promise);

  // 'window-ready' is called if an error occurred loading the client, or once
  // the client has connected to the User Agent Service correctly.
  browser.once('window-ready', error => {
    if (browser.isDestroyed()) {
      return;
    }

    // Show this BW (and a devtools window on error).
    browser.show();
    if (BUILD_CONFIG.development && error) {
      browser.openDevTools({ detach: true });
    }

    // If Tofino is not the default browser, offer.
    if (shouldAskToSetDefaultBrowser) {
      browser.webContents.send('should-set-default-browser');
    }

    if (appState) {
      browser.webContents.send('session-restore-available', appState);
    } else {
      browser.webContents.send('session-restore-unavailable');
    }

    readyDeferred.resolve(browser);
  });

  // Start loading browser chrome.
  browser.loadURL(BROWSER_CHROME_URL);

  bindBrowserWindowEvents(browser);
  hotkeys.bindBrowserWindowHotkeys(browser);
  downloads.registerDownloadHandlers(browser);

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

  return readyDeferred.promise;
}

export function closeBrowserWindow(bw) {
  const index = browserWindows.indexOf(bw);
  if (index < 0) {
    return;
  }
  browserWindows.splice(index, 1);
  browserWindowLoaded.delete(bw);

  bw.close();
}

export function reloadBrowserWindow(bw) {
  const appState = getSessionKey(['browserWindows', bw.windowId], { default: null });

  if (!appState) {
    logger.warn(`No app state found for browser window ${bw.windowId}`);
  } else {
    bw.webContents.once('did-finish-load', () => {
      bw.webContents.send('session-restore-available', appState);
    });
  }

  bw.webContents.reload();
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

const EVENTS_TO_PROPAGATE = ['scroll-touch-begin', 'scroll-touch-end'];
function bindBrowserWindowEvents(bw) {
  EVENTS_TO_PROPAGATE.forEach(event => {
    bw.on(event, () => bw.webContents.send(event));
  });
}
