/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * This module handles opening a URL when starting Tofino with command line args, or
 * opening a URL when Tofino is the default browser, or when dragging a file to be loaded
 * via Tofino. Most of this logic is taken from Brave's implementation.
 * https://github.com/brave/browser-laptop/blob/master/app/cmdLine.js
 */
import electron from 'electron';
import { parse } from 'url';
import * as BW from './browser-window';
import * as protocols from './protocols';
import { parseArgs } from '../shared/environment';
import BUILD_CONFIG from '../build-config';

const { app } = electron;
const isDarwin = process.platform === 'darwin';

const isValidURL = url => {
  // Strip the trailing ':' in `parsedUrl.protocol` so we can use
  // DEFAULT_PROTOCOLS, which do not use the trailing colon
  const protocol = parse(url).protocol;
  if (!protocol) {
    return false;
  }
  return protocols.DEFAULT_PROTOCOLS.includes(protocol.replace(/:$/, ''));
};

// For macOS, there are events like open-url instead
if (!isDarwin) {
  // Checks an array of arguments if it can find a url
  for (const arg of parseArgs()._) {
    if (isValidURL(arg)) {
      BW.focusOrOpenWindow(arg);
    }
  }
}

app.on('ready', () => {
  if (!BUILD_CONFIG.development && !process.env.TEST) {
    const appAlreadyStartedShouldQuit = app.makeSingleInstance(argv => {
      // Someone tried to run a second instance, we should focus our window.
      if (isDarwin) {
        BW.focusOrOpenWindow();
      } else {
        for (const arg of parseArgs(argv)._) {
          if (isValidURL(arg)) {
            BW.focusOrOpenWindow(arg);
          }
        }
      }
    });
    if (appAlreadyStartedShouldQuit) {
      app.exit(0);
    }
  }
});

app.on('will-finish-launching', () => {
  // User clicked a link when Tofino was the default or via command line like:
  // open -a Tofino http://www.brave.com
  app.on('open-url', (event, path) => {
    event.preventDefault();
    if (isValidURL(path)) {
      BW.focusOrOpenWindow(path);
    }
  });

  // User clicked on a file or dragged a file to the dock on macOS
  app.on('open-file', (event, path) => {
    event.preventDefault();
    BW.focusOrOpenWindow(path);
  });
});
