// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/
/* eslint prefer-arrow-callback: 0 */

import expect from 'expect';
import { quickTest } from '../../build-config';
import Driver from '../utils/driver';

describe('application launch', function() {
  if (quickTest) {
    it.skip('all tests');
    return;
  }

  this.timeout(30000);

  beforeEach(async function() {
    await Driver.start();
  });

  afterEach(async function() {
    await Driver.stop();
  });

  it('shows an initial window and tab', async function() {
    const { app } = Driver;

    // The selected window appears to be the first BrowserWindow opened.
    let { value: url } = await app.client.url();
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

    ({ value: url } = await app.client.url());
    expect(url.startsWith('tofino://mozilla')).toBe(true);
  });
});
