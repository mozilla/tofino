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

import electron from 'electron';

import * as protocols from './protocols';
import * as hotkeys from './hotkeys';
import * as menu from './menu/index';
import * as spawn from './spawn';
import * as BW from './browser-window';
import * as certs from './certificates';
import * as ProfileDiffTypes from '../shared/constants/profile-diff-types';
import { startUpdateChecks } from './updater';
import { performApplicationSessionRestore } from './session-restore';
import * as state from './state';
import './command-line';
import './pinned-tabs';

const app = electron.app; // control application life.
const ipc = electron.ipcMain;
const globalShortcut = electron.globalShortcut;
const userAgentClient = state.userAgentClient;

protocols.registerStandardSchemes();
certs.setupCertificateHandlers();

// Start the content and UA services running on a different process
spawn.startContentService();
spawn.startUserAgentService(userAgentClient);

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', async function() {
  // Force the menu to be built at least once on startup
  menu.buildAppMenu(menuData);

  // Register http content protocols, e.g. for displaying `tofino://` pages.
  protocols.registerHttpProtocols();

  performApplicationSessionRestore();

  // Emit an event to the main process so we can mark the app
  // as initialized
  ipc.emit('main:first-window-created');

  startUpdateChecks();
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
    const bw = await BW.createBrowserWindow();
    bw.webContents.send('new-tab');
    menu.buildAppMenu(menuData);
  }
});

ipc.on('new-browser-window', async function() {
  const bw = await BW.createBrowserWindow();
  bw.webContents.send('new-tab');
  menu.buildAppMenu(menuData);
});

ipc.on('close-browser-window', BW.onlyWhenFromBrowserWindow(async function(bw) {
  await BW.closeBrowserWindow(bw);
}));

ipc.on('reload-browser-window', BW.onlyWhenFromBrowserWindow(async function(bw) {
  await BW.reloadBrowserWindow(bw);
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

ipc.on('set-default-browser', () => protocols.setDefaultBrowser());

const menuData = {};

userAgentClient.on('diff', command => {
  if (command.type === ProfileDiffTypes.RECENT_BOOKMARKS) {
    menuData.recentBookmarks = command.payload;
    menu.buildAppMenu(menuData);
  }
});
