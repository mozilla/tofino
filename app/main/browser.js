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
// Must go before any require statements.
const browserStartTime = Date.now();

/* eslint no-console: 0 */

process.on('uncaughtException', (err) => {
  console.log(err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, p) => {
  console.log(`Unhandled Rejection at: Promise ${p}, reason: ${reason}`);
  process.exit(2);
});

import path from 'path';
import electron from 'electron';
import electronLocalshortcut from 'electron-localshortcut';

import BrowserMenu from './browser-menu';
import * as instrument from '../services/instrument';
import * as BUILD_CONFIG from '../../build-config';
import * as profileDiffs from '../shared/profile-diffs';
import configureStore from './store/store';

const BrowserWindow = electron.BrowserWindow;  // create native browser window.
const app = electron.app; // control application life.
const ipc = electron.ipcMain;
const globalShortcut = electron.globalShortcut;

const uiDir = path.join(__dirname, '..', 'ui');

// Keep a global references of the window objects, if you don't, the windows will
// be closed automatically when the JavaScript object is garbage collected.
const mainWindows = [];

function sendToAllWindows(event, args) {
  console.log(`diff ${JSON.stringify(args)}`);
  for (const mainWindow of mainWindows) {
    mainWindow.webContents.send(event, args);
  }
}

const store = configureStore();
let currentState;

function sendDiffsToWindows(force = false) {
  const previousState = currentState;
  currentState = store.getState();
  if (force || !previousState || currentState.bookmarks !== previousState.bookmarks) {
    const bookmarkSet = currentState.bookmarks
      .valueSeq()
      .map(bookmark => bookmark.location)
      .toSet();
    sendToAllWindows('profile-diff', profileDiffs.bookmarks(bookmarkSet.toJS()));
  }

  if (force || !previousState || currentState.bookmarks !== previousState.bookmarks) {
    const recentBookmarks = currentState.bookmarks
      .valueSeq()
      .sortBy(bookmark => bookmark.createdAt)
      .take(5);
    BrowserMenu.build({ bookmarks: recentBookmarks });
  }
  if (force || !previousState || currentState.locations !== previousState.locations) {
    sendToAllWindows('profile-diff', profileDiffs.completions(currentState.locations.toJS()));
  }
}

store.subscribe(sendDiffsToWindows);

function fileUrl(str) {
  let pathName = path.resolve(str).replace(/\\/g, '/');

  // Windows drive letter must be prefixed with a slash
  if (pathName[0] !== '/') {
    pathName = `/${pathName}`;
  }

  return encodeURI(`file://${pathName}`);
}

function createWindow(tabInfo) {
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
  mainWindows.push(browser);

  browser.loadURL(fileUrl(path.join(uiDir, 'browser', 'browser.html')));

  if (BUILD_CONFIG.development) {
    browser.openDevTools({ detach: true });
  }

  // Emitted when the window is closed.
  browser.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    const index = mainWindows.indexOf(browser);
    if (index > -1) {
      mainWindows.splice(index, 1);
    }
  });

  electronLocalshortcut.register(browser, 'CmdOrCtrl+L', () => {
    browser.webContents.send('focus-urlbar');
  });

  electronLocalshortcut.register(browser, 'CmdOrCtrl+R', () => {
    browser.webContents.send('page-reload');
  });

  browser.webContents.once('did-finish-load', () => {
    const browserDidFinishLoadTime = Date.now();
    instrument.event('browser', 'READY', 'ms', browserDidFinishLoadTime - browserStartTime);

    browser.show();

    if (tabInfo) {
      browser.webContents.send('tab-attach', tabInfo);
    }

    // TODO: Don't achieve this with a hammer.
    sendDiffsToWindows(true);
  });
}

const appStartupTime = Date.now();
instrument.event('app', 'STARTUP');

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', () => {
  const appReadyTime = Date.now();
  instrument.event('app', 'READY', 'ms', appReadyTime - appStartupTime);

  createWindow();
});

// Unregister all shortcuts.
app.on('will-quit', () => globalShortcut.unregisterAll());

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }

  // Set a simple menu since all browser windows are closed.
  BrowserMenu.default();
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindows.length === 0) {
    createWindow();
  }
});

ipc.on('instrument-event', (event, args) => {
  // Until we transpile app/, we can't destructure in the argument list or inline here.
  instrument.event(args.name, args.method, args.label, args.value);
});

ipc.on('new-window', () => createWindow());

ipc.on('window-ready', event => {
  BrowserWindow.fromWebContents(event.sender).show();
});

ipc.on('tab-detach', (event, tabInfo) => createWindow(tabInfo));

ipc.on('profile-command', (event, args) => {
  store.dispatch(args);
});
