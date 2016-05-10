// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/
/* eslint prefer-arrow-callback: 0 */

import expect from 'expect';
import { quickTest } from '../../build-config';
import Driver from '../utils/driver';

const STARTING_TAB_COUNT = 1;

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
    expect(initialPages.length).toEqual(STARTING_TAB_COUNT, 'Have one tab to start.');

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

  it('CmdOrCtrl+[1-8]: Select Tab', async function() {
    const MAX = 8;
    const state = await Driver.getReduxState();
    const initialPages = state.pages.pages;
    expect(initialPages.length).toEqual(STARTING_TAB_COUNT, 'Have one tab to start.');

    // Open tabs until we have 8
    for (let i = initialPages.length; i < MAX; i++) {
      Driver.ipcSendToMain('synthesize-accelerator', 'CmdOrCtrl+T');
    }
    await Driver.waitUntilReduxState(currentState =>
      currentState.pages.pages.length === MAX);

    for (let i = 0; i < MAX; i++) {
      Driver.ipcSendToMain('synthesize-accelerator', `CmdOrCtrl+${i + 1}`);
      await Driver.waitUntilReduxState(currentState =>
        currentState.pages.currentPageIndex === i);
      expect(true).toEqual(true, `Selected tab index ${i} when firing CmdOrCtrl+${i + 1}`);
    }

    // Close all tabs except the first
    for (let i = MAX; i > 1; i--) {
      Driver.ipcSendToRenderer('close-tab');
    }

    await Driver.waitUntilReduxState(currentState =>
      currentState.pages.currentPageIndex === 0 &&
      currentState.pages.pages.length === 1);

    // Fire all the CmdOrCtrl+[1-8] commands again to ensure
    // nothing breaks when there are less tabs than can be selected
    for (let i = 1; i <= MAX; i++) {
      Driver.ipcSendToMain('synthesize-accelerator', `CmdOrCtrl+${i}`);
    }

    await Driver.waitUntilReduxState(currentState =>
      currentState.pages.currentPageIndex === 0);
    expect(true).toEqual(true,
      'Does not throw when CmdOrCtrl+[1-8] is out of bounds');
  });

  it('CmdOrCtrl+Alt+[Left/Right]: Select Tab', async function() {
    const state = await Driver.getReduxState();
    const initialPages = state.pages.pages;
    expect(initialPages.length).toEqual(STARTING_TAB_COUNT, 'Have one tab to start.');

    Driver.ipcSendToMain('synthesize-accelerator', 'CmdOrCtrl+T');
    await Driver.waitUntilReduxState(currentState =>
      currentState.pages.currentPageIndex === 1 &&
      currentState.pages.pages.length === 2);

    Driver.ipcSendToMain('synthesize-accelerator', 'CmdOrCtrl+Alt+Left');
    await Driver.waitUntilReduxState(currentState =>
      currentState.pages.currentPageIndex === 0);

    Driver.ipcSendToMain('synthesize-accelerator', 'CmdOrCtrl+Alt+Right');
    await Driver.waitUntilReduxState(currentState =>
      currentState.pages.currentPageIndex === 1);

    Driver.ipcSendToRenderer('close-tab');
    await Driver.waitUntilReduxState(currentState =>
      currentState.pages.pages.length === STARTING_TAB_COUNT &&
      currentState.pages.currentPageIndex === 0);
  });
});
