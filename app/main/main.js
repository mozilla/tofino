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
 * Disable the eslint "strict" and "no-commonjs" rules, since this is a script
 * that runs in node without any babel support, so it's not not a module
 * implicitly running in strict mode, and we can't use the import syntax.
 */
/* eslint-disable strict */
/* eslint-disable import/no-commonjs */
'use strict';

// Must go before any require statements.
const browserStartTime = Date.now();

require('babel-polyfill');
require('babel-register')();

const path = require('path');
const electron = require('electron');
const instrument = require('../services/instrument');
const server = require('../services/server');
const app = electron.app; // control application life.
const BrowserWindow = electron.BrowserWindow;  // create native browser window.
const BrowserMenu = require('./browser-menu').default;
const isProduction = require('../../shared/util').isProduction;
const ipc = electron.ipcMain;
const globalShortcut = electron.globalShortcut;
const electronLocalshortcut = require('electron-localshortcut');

const root = path.dirname(__dirname);
const staticDir = path.join(__dirname, '..', '..', 'static');

// Keep a global references of the window objects, if you don't, the windows will
// be closed automatically when the JavaScript object is garbage collected.
const mainWindows = [];

function createWindow(tabInfo) {
  // Create the browser window.
  const browser = new BrowserWindow({
    center: false,
    width: 1024,
    height: 720,
    frame: false,
    show: false,
  });
  mainWindows.push(browser);

  browser.loadURL('http://localhost:8765/browser.html');

  if (!isProduction()) {
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
    } else {
      browser.webContents.send('new-tab');
    }
  });
}

function registerFileProtocol(scheme, mapper) {
  const protocol = electron.protocol;

  protocol.registerFileProtocol(scheme, (request, callback) => {
    let url = request.url.substr(scheme.length + 3);
    let pos = url.indexOf('?');
    if (pos >= 0) {
      url = url.substring(0, pos);
    }
    pos = url.indexOf('#');
    if (pos >= 0) {
      url = url.substring(0, pos);
    }
    const file = mapper(url);
    callback({ path: file });
  }, error => {
    if (error) {
      console.error(`Failed to register ${scheme} protocol`, error);
    }
  });
}

const appStartupTime = Date.now();
instrument.event('app', 'STARTUP');

// Kick off the internal webserver so we have HMR
server.serve(staticDir);

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', () => {
  const appReadyTime = Date.now();
  instrument.event('app', 'READY', 'ms', appReadyTime - appStartupTime);

  registerFileProtocol('atom', url => {
    if (url.indexOf('/') === '-1') {
      url = `${url}/index.html`;
    }
    return path.normalize(path.join(root, 'content', url));
  });
  registerFileProtocol('libs', url => path.normalize(path.join(root, 'libs', url)));

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

ipc.on('new-window', createWindow);

ipc.on('window-ready', event => {
  BrowserWindow.fromWebContents(event.sender).show();
});

ipc.on('update-menu', (event, data) => BrowserMenu.build(data));

ipc.on('tab-detach', (event, tabInfo) => createWindow(tabInfo));
