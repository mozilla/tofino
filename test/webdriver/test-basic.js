// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import Driver from '../utils/driver';
import BUILD_CONFIG from '../../app/build-config';

// The check that needs this is currently commented out.
// import { HOME_PAGE } from '../../app/ui/browser-modern/constants/ui';

describe('application launch', function() {
  if (BUILD_CONFIG.development || BUILD_CONFIG.offerDefault) {
    // Skip test on development builds, since app.client returns the devtools
    // window instead of the browser window, so all our checks are bogus.
    // Also skip if we're going to show the default browser prompt: it
    // causes us to fail to detect the creation of the window.
    return;
  }

  this.timeout(Driver.TEST_TIMEOUT_IN_MS);

  beforeEach(async function() {
    await Driver.start();
  });

  afterEach(async function() {
    await Driver.stop();
  });

  it('shows an initial window and tab', async function() {
    const { app } = Driver;

    // The selected window appears to be the first BrowserWindow opened.
    const { value: url } = await app.client.url();
    expect(url.startsWith('file://')).toBe(true);
    expect(url.endsWith('browser.html')).toBe(true);

    // BrowserWindows and <webview>s are considered to be windows by spectron.
    // Since we always open an initial tab there should be two windows.
    const count = await app.client.getWindowCount();
    expect(count).toEqual(2);

    const { value: handle } = await app.client.windowHandle();
    const { value: handles } = await app.client.windowHandles();

    expect(handles.length).toEqual(2);
    const pos = handles.indexOf(handle);
    expect(pos).toBeGreaterThanOrEqualTo(0);

    // There doesn't appear to be a way to identify windows in spectron, so we
    // just assume that the window that isn't the BrowserWindow is the first
    // <webview>
    const webviewHandle = handles[1 - pos];
    await app.client.window(webviewHandle);

    // This doesn't work right now.
    /*
    ({ value: url } = await app.client.url());
    console.log("URL is " + url);
    expect(url.startsWith("tofino://")).toBe(true);
    */
  });
});
