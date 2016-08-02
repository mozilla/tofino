// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/
/* eslint-disable import/no-commonjs */

/**
 * This preload script gets injected via <script> in the renderer process
 * for use with tests.
 */

/* eslint-env browser */

window.$ = (selector, scope = document) => scope.querySelector(selector);
window.$$ = (selector, scope = document) => scope.querySelectorAll(selector);

// Create a container div that will render the entire app
const container = document.createElement('div');
container.setAttribute('id', 'browser-container');
document.body.appendChild(container);

// Require these so we can transpile the client code on the fly
require('babel-polyfill');
require('babel-register')();
