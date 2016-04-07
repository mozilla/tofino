/* eslint no-console: 0 */

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

const { isProduction } = require('../../shared/util');

const { app, BrowserWindow, ipcMain } = require('electron');

const events = require('events');

// Set once when the app is ready, never set again, never cleaned up.  Kept
// alive by `hiddenWindow`.
let hiddenBrowserWindow;

const hiddenWindow = new events.EventEmitter();

module.exports = hiddenWindow;

app.on('ready', function() {
  console.log('ready');
  hiddenBrowserWindow = new BrowserWindow({ width: 0, height: 0, show: false });
  hiddenBrowserWindow.loadURL('file://' + __dirname + '/hidden-window/hidden-window.html');

  // // To debug the hidden window JS, uncomment the following:
  // if (!isProduction()) {
  //   hiddenBrowserWindow.openDevTools({ detach: true });
  // }

  // Maintain a reference to keep `hiddenBrowserWindow` alive for as long as
  // `hiddenWindow` lives.
  hiddenWindow._hiddenBrowserWindow = hiddenBrowserWindow;
});

let onLine;
Object.defineProperty(hiddenWindow, 'onLine', {
    get: function () {
      return onLine;
    }
});

// Expose a navigator.onLine alike, and radiate 'online' and 'offline'
// events through the `hiddenWindow`.
ipcMain.on('online-status-changed', function(event, newOnLine) {
  console.log('online-status-changed');
  onLine = newOnLine;
  hiddenWindow.emit(newOnLine ? 'online' : 'offline');
});
