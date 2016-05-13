/* @flow */

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

/* eslint import/imports-first: "off" */
/* eslint no-console: 0 */

// Must go before any require statements.
const browserStartTime = Date.now();

import 'source-map-support/register';

process.on('uncaughtException', (err) => {
  console.error(err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, p) => {
  console.error(`Unhandled Rejection at: Promise ${JSON.stringify(p)}`);
  console.error(reason.stack);
  process.exit(2);
});

import path from 'path';
import electron from 'electron';

import * as hotkeys from './hotkeys';
import * as menu from './menu/index';
import * as instrument from '../services/instrument';
import registerAboutPages from './about-pages';
import { ProfileStorage } from '../services/storage';
import * as userAgentService from './user-agent-service';
const profileStoragePromise = ProfileStorage.open(path.join(__dirname, '..', '..'));
import { UI_DIR, fileUrl } from './util';
import BUILD_CONFIG from '../../build-config';

import WebSocket from 'ws';
import * as endpoints from '../shared/constants/endpoints';

const BrowserWindow = electron.BrowserWindow;  // create native browser window.
const app = electron.app; // control application life.
const ipc = electron.ipcMain;
const globalShortcut = electron.globalShortcut;

/**
 * Top-level list of Browser Windows.
 */
const browserWindowIds = [];

async function makeBrowserWindow(): Promise<electron.BrowserWindow> {
  const profileStorage = await profileStoragePromise;

  // TODO: don't abuse the storage layer's session ID generation to produce scopes.
  const scope = await profileStorage.startSession();

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

  browser.didFinishLoadPromise = new Promise((resolve, _reject) => {
    browser.webContents.once('did-finish-load', () => {
      const browserDidFinishLoadTime = Date.now();
      instrument.event('browser', 'READY', 'ms', browserDidFinishLoadTime - browserStartTime);

      resolve();
    });
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
  browser.loadURL(fileUrl(path.join(UI_DIR, 'browser', 'browser.html')));

  hotkeys.bindBrowserWindowHotkeys(browser);

  return browser;
}

const appStartupTime = Date.now();
instrument.event('app', 'STARTUP');

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', async function() {
  const appReadyTime = Date.now();
  instrument.event('app', 'READY', 'ms', appReadyTime - appStartupTime);

  // Force the menu to be built at least once on startup
  menu.build();

  // Register `about:*` protocols after app's 'ready' event
  registerAboutPages();

  await newBrowserWindow();
});

// Unregister all shortcuts.
app.on('will-quit', () => globalShortcut.unregisterAll());

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
    return;
  }

  // Set a simple menu since all browser windows are closed.
  menu.build({ osxMinimal: true });
});

app.on('activate', async function() {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (browserWindowIds.length === 0) {
    await newBrowserWindow();
  }
});

async function newBrowserWindow(tabInfo: ?Object) {
  const bw = await makeBrowserWindow(tabInfo);
  browserWindowIds.push(bw.id);
  return bw;
}

async function closeBrowserWindow(id: number) {
  const index = browserWindowIds.indexOf(id);
  if (index < 0) {
    return;
  }
  browserWindowIds.splice(index, 1);

  const bw = BrowserWindow.fromId(id);
  if (bw) {
    bw.close();
  }
}

ipc.on('new-browser-window', async function(_event, args) {
  await newBrowserWindow(args);
});

ipc.on('close-browser-window', async function (event, _args) {
  if (!event || !event.sender) {
    return;
  }
  const bw = BrowserWindow.fromWebContents(event.sender);
  if (!bw) {
    return;
  }
  await closeBrowserWindow(bw.id);
});

ipc.on('instrument-event', (event, args) => {
  // Until we transpile app/, we can't destructure in the argument list or inline here.
  instrument.event(args.name, args.method, args.label, args.value);
});

ipc.on('window-ready', (event, ...args) => {
  // Pass through to the BrowserWindow instance.  This just makes it easier to do things per-BW.
  const bw = BrowserWindow.fromWebContents(event.sender);
  if (bw) {
    bw.emit('window-ready', ...args);
  }
});

ipc.on('synthesize-accelerator', (...args) => {
  hotkeys.handleIPCAcceleratorCommand(...args);
  menu.handleIPCAcceleratorCommand(...args);
});

let ws = undefined;


profileStoragePromise.then(async function(profileStorage) {
  await userAgentService.start(profileStorage, endpoints.UA_SERVICE_PORT, false);

  ws = new WebSocket(`${endpoints.UA_SERVICE_WS}/diffs`);

  ws.on('open', () => {
    // Nothing for now.
  });

  ws.on('message', (data, flags) => {
    // flags.binary will be set if a binary data is received.
    // flags.masked will be set if the data was masked.
    if (flags.binary) {
      return;
    }
    const command = JSON.parse(data);
    if (!command) {
      return;
    }

    if (command.type === 'initial') {
      menu.build({ recentBookmarks: command.payload.recentStars });
      return;
    }

    if (command.type === '/stars/recent') {
      menu.build({ recentBookmarks: command.payload });
    }
  });
});
