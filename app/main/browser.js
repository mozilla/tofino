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

import electron from 'electron';

import * as hotkeys from './hotkeys';
import * as menu from './menu/index';
import * as instrument from '../services/instrument';
import registerAboutPages from './about-pages';
import * as spawn from './spawn';
import * as BW from './browser-window';
import UserAgentClient from '../shared/user-agent-client';

const app = electron.app; // control application life.
const ipc = electron.ipcMain;
const globalShortcut = electron.globalShortcut;
const userAgentClient = new UserAgentClient();

const appStartupTime = Date.now();
instrument.event('app', 'STARTUP');

// Start the content and UA services running on a different process
spawn.contentService();
spawn.userAgentService();

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', async function() {
  const appReadyTime = Date.now();
  instrument.event('app', 'READY', 'ms', appReadyTime - appStartupTime);

  // Force the menu to be built at least once on startup
  menu.buildAppMenu(menuData);

  // Register `about:*` protocols after app's 'ready' event
  registerAboutPages();

  await BW.createBrowserWindow(userAgentClient, () => {
    instrument.event('browser', 'READY', 'ms', Date.now() - browserStartTime);
  });
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

  // Rebuild the menu to get the simplified version
  menu.buildAppMenu(menuData);
});

app.on('activate', async function() {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (electron.BrowserWindow.getAllWindows().length === 0) {
    await BW.createBrowserWindow(userAgentClient, () => menu.buildAppMenu(menuData));
  }
});

ipc.on('new-browser-window', async function() {
  await BW.createBrowserWindow(userAgentClient, () => menu.buildAppMenu(menuData));
});

ipc.on('close-browser-window', BW.onlyWhenFromBrowserWindow(async function(bw) {
  await BW.closeBrowserWindow(bw);
}));

ipc.on('window-ready', BW.onlyWhenFromBrowserWindow((bw, ...args) => {
  // Pass through to the BrowserWindow instance.  This just makes it easier to do things per-BW.
  bw.emit('window-ready', ...args);
}));

ipc.on('open-menu', BW.onlyWhenFromBrowserWindow(bw => {
  menu.buildWindowMenu(menuData).popup(bw);
}));

ipc.on('synthesize-accelerator', (...args) => {
  hotkeys.handleIPCAcceleratorCommand(...args);
  menu.handleIPCAcceleratorCommand(...args);
});

ipc.on('instrument-event', (event, args) => {
  // Until we transpile app/, we can't destructure in the argument list or inline here.
  instrument.event(args.name, args.method, args.label, args.value);
});

const menuData = {};

// Connect UA client to the UA service
userAgentClient.connect();
userAgentClient.on('diff', (command) => {
  if (command.type === 'initial') {
    menuData.recentBookmarks = command.payload.recentStars;
    menu.buildAppMenu(menuData);
    return;
  }

  if (command.type === '/stars/recent') {
    menuData.recentBookmarks = command.payload;
    menu.buildAppMenu(menuData);
  }
});
