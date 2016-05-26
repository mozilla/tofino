// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import Driver from '../utils/driver';
import { HOME_PAGE } from '../../app/ui/browser/constants/ui';

describe('application launch', function() {
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
    let { value: url } = await app.client.url();
    expect(url.startsWith('file://')).toBe(true);
    expect(url.endsWith('browser.html')).toBe(true);

    // BrowserWindows and <webview>s are considered to be windows by spectron.
    // Since we always open an initial tab, and we have a hidden window service,
    // there should be three windows.
    const count = await app.client.getWindowCount();
    expect(count).toEqual(3);

    const { value: handle } = await app.client.windowHandle();
    const { value: handles } = await app.client.windowHandles();

    expect(handles.length).toEqual(3);
    const pos = handles.indexOf(handle);
    expect(pos).toBeGreaterThanOrEqualTo(0);

    // Ensure we can find a webview window
    await Driver.setTargetByURL(HOME_PAGE);
    ({ value: url } = await app.client.url());
    expect(url.startsWith(HOME_PAGE)).toBe(true);
  });
});
