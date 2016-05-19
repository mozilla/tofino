// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/
/* eslint-disable import/no-commonjs */

/**
 * Script gets injected into the renderer process for renderer tests.
 * Since the BrowserWindow persists between test suites, this is only executed once.
 */

// Require these so we can transpile the client code on the fly
require('babel-polyfill');
require('babel-register')();

// Create a container div that will render the entire app
const container = document.createElement('div');
container.setAttribute('id', 'browser-container');
document.body.appendChild(container);

// Pull in all the client code which will automatically inject
// into #browser-container.
require('../../app/ui/browser/index');
