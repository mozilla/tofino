// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import jsdom from 'jsdom';

/**
 * Takes an array of objects containing key/value properties to
 * apply to a virtualized DOM (via jsdom) containing <webview>
 * elements with the passed in properties. Returns a promise
 * resolving to the virtual `window`.
 *
 * @param {Array<Object>} descriptors
 * @return {Promise<Window>}
 */
export function createWebViewMocks(descriptors) {
  const domText = descriptors.map(desc => {
    const props = Object.keys(desc).map(prop => `${prop}='${desc[prop]}'`);
    return `<webview ${props.join(' ')} />`;
  }).join(' ');

  return new Promise(resolve => {
    const inc = (el, attr) => () => el.setAttribute(attr, ~~el.getAttribute(attr) + 1);
    jsdom.env({
      html: domText,
      done(err, window) {
        const webviews = window.document.querySelectorAll('webview');
        Array.prototype.forEach.call(webviews, webview => {
          webview.goBack = inc(webview, 'back-count');
          webview.goForward = inc(webview, 'forward-count');
          webview.reload = inc(webview, 'reload-count');
        });

        resolve(window);
      },
    });
  });
}
