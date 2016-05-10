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
import * as model from '../model/index';
import * as storeStore from './store/store';
import registerAboutPages from './about-pages';
import { ProfileStorage } from '../services/storage';
import * as userAgentService from './user-agent-service';
const profileStoragePromise = ProfileStorage.open(path.join(__dirname, '..', '..'));
import Immutable from 'immutable';
import { UI_DIR, fileUrl } from './util';

const BrowserWindow = electron.BrowserWindow;  // create native browser window.
const app = electron.app; // control application life.
const ipc = electron.ipcMain;
const globalShortcut = electron.globalShortcut;


let currentState = new model.UserAgent();
const store = storeStore.configureStore(currentState);

function sendToAllWindows(event: string, args: Object): void {
  const windows = store.getState().browserWindows;

  if (!windows) {
    return;
  }

  windows.forEach((id) => {
    const bw = BrowserWindow.fromId(id);
    if (bw) {
      bw.webContents.send(event, args);
    }
  });
}

function sendDiffsToWindows(): void {
  const previousState = currentState;
  currentState = store.getState();

  // TODO: handle empty state.
  if (previousState && !Immutable.is(currentState.browserWindows,
                                     previousState.browserWindows)) {
    // Show new windows, taking care to use key IDs rather than possibly deleted ID members.
    currentState.browserWindows.forEach((id) => {
      if (previousState.browserWindows.has(id)) {
        return;
      }
      const bw = BrowserWindow.fromId(id);
      if (bw) {
        bw.didFinishLoadPromise.then(() => bw.show());
      }
    });

    // Close old windows, taking care to use key IDs rather than possibly deleted ID members.
    previousState.browserWindows.forEach((id) => {
      if (currentState.browserWindows.has(id)) {
        return;
      }
      const bw = BrowserWindow.fromId(id);
      if (bw) {
        bw.didFinishLoadPromise.then(() => bw.close());
      }
    });
  }

  const recentBookmarksChanged =
    !previousState ||
    !Immutable.is(currentState.recentBookmarks, previousState.recentBookmarks);

  if (recentBookmarksChanged) {
    menu.build({ recentBookmarks: currentState.recentBookmarks });
  }

  const bookmarksChanged =
    !previousState ||
    !Immutable.is(currentState.bookmarks, previousState.bookmarks);

  if (bookmarksChanged) {
    sendToAllWindows('profile-diff', profileDiffs.bookmarks(currentState.bookmarks.toJS()));
  }
}

store.subscribe(sendDiffsToWindows);

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

  // Extract the initial state from the profile storage.
  const profileStorage = await profileStoragePromise;
  const starredLocations = await profileStorage.starredURLs();
  const recentlyStarredLocations = await profileStorage.recentlyStarred();
  const userAgent = store.getState()
    .set('bookmarks', starredLocations)
    .set('recentBookmarks', new Immutable.List(recentlyStarredLocations));
  store.dispatch({ type: 'REPLACE', payload: userAgent });

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
  if (store.getState().browserWindows.isEmpty()) {
    await newBrowserWindow();
  }
});

async function newBrowserWindow(tabInfo: ?Object) {
  const bw = await makeBrowserWindow(tabInfo);

  const state = store.getState();
  const newState = state.set('browserWindows', state.browserWindows.add(bw.id));

  store.dispatch({ type: 'REPLACE', payload: newState });
}

async function closeBrowserWindow(id: number) {
  const state = store.getState();
  const newState = state.set('browserWindows', state.browserWindows.delete(id));

  store.dispatch({ type: 'REPLACE', payload: newState });
}

ipc.on('new-browser-window', async function(_event, args) {
  await newBrowserWindow(args);
});

ipc.on('close-browser-window', async function (event, _args) {
  const bw = BrowserWindow.fromWebContents(event.sender);
  await closeBrowserWindow(bw.id);
});

ipc.on('instrument-event', (event, args) => {
  // Until we transpile app/, we can't destructure in the argument list or inline here.
  instrument.event(args.name, args.method, args.label, args.value);
});

// Inject initial state into the window. Eventually this will behave like session restore.
// Whenever you add something to the app state, make sure to also add it here.

ipc.on('window-loaded', (event) => {
  const bookmarkSet = store.getState().bookmarks || Immutable.Set();
  const recentBookmarks = store.getState().recentBookmarks || Immutable.List();
  event.returnValue = {
    bookmarks: bookmarkSet.toJS(),
    recentBookmarks: recentBookmarks.toJS(),
  };
});

ipc.on('window-ready', event => {
  const bw = BrowserWindow.fromWebContents(event.sender);
  if (bw) {
    bw.show();
  }
});

ipc.on('synthesize-accelerator', (...args) => {
  hotkeys.handleIPCAcceleratorCommand(...args);
  menu.handleIPCAcceleratorCommand(...args);
});

profileStoragePromise.then((profileStorage) => {
  userAgentService.start(profileStorage, 9090, true);
});
