// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/
/* eslint prefer-arrow-callback: 0 */

import expect from 'expect';
import { quickTest } from '../../build-config';
import Driver from '../utils/driver';

describe('hotkeys', function() {
  if (quickTest) {
    it.skip('all tests');
    return;
  }

  this.timeout(30000);

  /**
   * These tests all run in the same browser cycle,
   * so ensure tests are cleaned up properly
   */
  before(async function() {
    await Driver.start();
  });

  after(async function() {
    await Driver.stop();
  });

  it('CmdOrCtrl+T: New Tab', async function() {
    let state = await Driver.getReduxState();
    const initialPages = state.pages.pages;
    expect(initialPages.length).toBeGreaterThan(0, 'Have atleast one tab to start.');

    Driver.ipcSendToMain('synthesize-accelerator', 'CmdOrCtrl+T');

    await Driver.waitUntilReduxState(currentState =>
      currentState.pages.pages.length === initialPages.length + 1);

    state = await Driver.getReduxState();
    expect(state.pages.pages.length).toEqual(initialPages.length + 1,
      'Got a new page');

    // Clean up
    Driver.ipcSendToRenderer('close-tab');
    await Driver.waitUntilReduxState(currentState =>
      currentState.pages.pages.length === initialPages.length);
  });
});
