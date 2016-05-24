// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/
/* eslint prefer-arrow-callback: 0 */
/* eslint no-undef: 0 */

import expect from 'expect';

describe('renderer - sanity checks', function() {
  it('has access to expected globals', function() {
    expect(window).toExist();
    expect(document).toExist();

    // Get globals from the browser/index.jsx app
    expect(window.app).toExist();
    expect(window.app.store).toExist();

    // Gets helpers from renderer-setup.js
    expect($).toExist();
    expect($$).toExist();
  });

  it('renders basic components', function() {
    expect($('#browser-container')).toExist();
    expect($('#browser-location-title-bar').hasAttribute('hidden')).toBe(true);
    expect($$('#browser-tabbar .tab').length).toBe(1);
    expect($$('webview').length).toBeGreaterThan(0);
  });
});
