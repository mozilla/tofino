/* eslint prefer-arrow-callback: 0 */

import expect from 'expect';
import { Application } from 'spectron';
import { quickTest } from '../../build-config';
import { getRoot, getElectronPath } from '../../build/utils';

describe('application launch', function() {
  if (quickTest) {
    it.skip('all tests');
    return;
  }

  this.timeout(30000);
  const executable = getElectronPath();

  beforeEach(async function() {
    this.app = new Application({
      path: executable,
      args: [getRoot()],
      env: process.env,
    });
    await this.app.start();
    expect(this.app.isRunning()).toBe(true);
    await this.app.client.waitUntilWindowLoaded();

    // Wait for both BrowserWindow and first tab webview to exist
    await this.app.client.waitUntil(function() {
      return this.getWindowCount().then((count) => count === 2);
    });
  });

  it('shows an initial window and tab', async function() {
    // The selected window appears to be the first BrowserWindow opened.
    let { value: url } = await this.app.client.url();
    expect(url.startsWith('file://')).toBe(true);
    expect(url.endsWith('browser.html')).toBe(true);

    // BrowserWindows and <webview>s are considered to be windows by spectron.
    // Since we always open an initial tab there should be two windows.
    const count = await this.app.client.getWindowCount();
    expect(count).toEqual(2);

    const { value: handle } = await this.app.client.windowHandle();
    const { value: handles } = await this.app.client.windowHandles();

    expect(handles.length).toEqual(2);
    const pos = handles.indexOf(handle);
    expect(pos).toBeGreaterThanOrEqualTo(0);

    // There doesn't appear to be a way to identify windows in spectron, so we
    // just assume that the window that isn't the BrowserWindow is the first
    // <webview>
    const webviewHandle = handles[1 - pos];
    await this.app.client.window(webviewHandle);

    ({ value: url } = await this.app.client.url());
    expect(url.startsWith('https://')).toBe(true);
  });

  afterEach(function() {
    if (this.app && this.app.isRunning()) {
      return this.app.stop();
    }
    return undefined;
  });
});
