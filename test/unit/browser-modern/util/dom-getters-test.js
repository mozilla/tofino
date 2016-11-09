// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import jsdom from 'jsdom';

import * as DOMGetters from '../../../../app/ui/browser-modern/util/dom-getters.js';

describe('dom getters', () => {
  it('should have a working implementation of `getWebViewForPageId`', () => {
    const pageId = 'foo';

    const window = jsdom.jsdom(`
      <div id="browser-page-${pageId}">
        <div>
          <webview>
        </div>
      </div>
    `).defaultView;

    expect(DOMGetters.getWebViewForPageId(window.document, pageId))
      .toEqual(window.document.querySelector('webview'));
  });

  it('should have a working implementation of `getURLBarForPageId`', () => {
    const pageId = 'foo';

    const window = jsdom.jsdom(`
      <div id="browser-navbar-${pageId}">
        <div>
          <div class="browser-location">
            <div>
              <input>
            <div>
          </div>
        </div>
      </div>
    `).defaultView;

    expect(DOMGetters.getURLBarForPageId(window.document, pageId))
      .toEqual(window.document.querySelector('input'));
  });
});
