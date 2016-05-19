// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/**
 * This preload script gets injected via <script> in the renderer process
 * for use with tests.
 */
window.$ = (selector, scope = document) => scope.querySelector(selector);
window.$$ = (selector, scope = document) => scope.querySelectorAll(selector);
