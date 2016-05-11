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

  this.timeout(Driver.TEST_TIMEOUT_IN_MS);

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

  it('CmdOrCtrl+N, CmdOrCtrl+Shift+W: New/Close Window', async function() {
    const state = await Driver.getReduxState();
    const initialPages = state.pages.pages;
    expect(initialPages.length).toEqual(1, 'Have one tab to start.');

    Driver.log("client.getWindowCount()");
    let windowCount = await Driver.client.getWindowCount();
    Driver.log("client.getWindowCount()");
    expect(windowCount).toEqual(2, 'Should only have one tab and one window open');

    Driver.ipcSendToMain('synthesize-accelerator', 'CmdOrCtrl+N');
    Driver.log("waitUntil=>client.getWindowCount()");
    await Driver.client.waitUntil(() => Driver.client.getWindowCount().then(count => count === 4));
    Driver.log("waitUntil=>client.getWindowCount()");
    Driver.log("client.getWindowCount()");
    windowCount = await Driver.client.getWindowCount();
    Driver.log("client.getWindowCount()");
    expect(windowCount).toEqual(4, 'Should only have two windows each with one tab');
    expect((await Driver.getReduxState()).pages.pages.length).toEqual(1,
      'Still one tab in our first window');

    Driver.ipcSendToMain('synthesize-accelerator', 'CmdOrCtrl+Shift+W');
    Driver.log("waitUntil=>client.getWindowCount()");
    await Driver.client.waitUntil(() => Driver.client.getWindowCount().then(count => count === 2));
    Driver.log("waitUntil=>client.getWindowCount()");
    expect((await Driver.getReduxState()).pages.pages.length).toEqual(1,
      'Still one tab in our first window');
  });

  it('CmdOrCtrl+T, CmdOrCtrl+W: New/Close Tab', async function() {
    let state = await Driver.getReduxState();
    const initialPages = state.pages.pages;
    expect(initialPages.length).toEqual(STARTING_TAB_COUNT, 'Have one tab to start.');

    Driver.ipcSendToMain('synthesize-accelerator', 'CmdOrCtrl+T');

    Driver.log("waitUntilReduxState!");
    await Driver.waitUntilReduxState(currentState =>
      currentState.pages.pages.length === initialPages.length + 1);
    Driver.log("waitUntilReduxState!");

    state = await Driver.getReduxState();
    expect(state.pages.pages.length).toEqual(initialPages.length + 1,
      'Got a new page');

    // Clean up
    Driver.ipcSendToMain('synthesize-accelerator', 'CmdOrCtrl+W');
    Driver.log("waitUntilReduxState!");
    await Driver.waitUntilReduxState(currentState =>
      currentState.pages.pages.length === initialPages.length);
    Driver.log("waitUntilReduxState!");
  });

  it('CmdOrCtrl+[1-8]: Select Tab', async function() {
    const MAX = 8;
    const state = await Driver.getReduxState();
    const initialPages = state.pages.pages;
    expect(initialPages.length).toEqual(STARTING_TAB_COUNT, 'Have one tab to start.');

    // Open tabs until we have 8
    Driver.log("send IPC for open tab!");
    for (let i = initialPages.length; i < MAX; i++) {
      Driver.ipcSendToMain('synthesize-accelerator', 'CmdOrCtrl+T');
    }
    Driver.log("send IPC for open tab!");
    Driver.log("waitUntilReduxState!");
    await Driver.waitUntilReduxState(currentState =>
      currentState.pages.pages.length === MAX);
    Driver.log("waitUntilReduxState!");

    Driver.log("send IPC for select tab!");
    for (let i = 0; i < MAX; i++) {
      Driver.ipcSendToMain('synthesize-accelerator', `CmdOrCtrl+${i + 1}`);
      await Driver.waitUntilReduxState(currentState =>
        currentState.pages.currentPageIndex === i);
      expect(true).toEqual(true, `Selected tab index ${i} when firing CmdOrCtrl+${i + 1}`);
    }
    Driver.log("send IPC for select tab!");

    // Close all tabs except the first
    Driver.log("send IPC for close tab!");
    for (let i = MAX; i > 1; i--) {
      Driver.ipcSendToRenderer('close-tab');
    }
    Driver.log("send IPC for close tab!");

    Driver.log("waitUntilReduxState!");
    await Driver.waitUntilReduxState(currentState =>
      currentState.pages.currentPageIndex === 0 &&
      currentState.pages.pages.length === 1);
    Driver.log("waitUntilReduxState!");

    // Fire all the CmdOrCtrl+[1-8] commands again to ensure
    // nothing breaks when there are less tabs than can be selected
    for (let i = 1; i <= MAX; i++) {
      Driver.ipcSendToMain('synthesize-accelerator', `CmdOrCtrl+${i}`);
    }

    Driver.log("waitUntilReduxState!");
    await Driver.waitUntilReduxState(currentState =>
      currentState.pages.currentPageIndex === 0);
    Driver.log("waitUntilReduxState!");
    expect(true).toEqual(true,
      'Does not throw when CmdOrCtrl+[1-8] is out of bounds');
  });

  it('CmdOrCtrl+Alt+[Left/Right]: Select Tab', async function() {
    const state = await Driver.getReduxState();
    const initialPages = state.pages.pages;
    expect(initialPages.length).toEqual(STARTING_TAB_COUNT, 'Have one tab to start.');

    Driver.ipcSendToMain('synthesize-accelerator', 'CmdOrCtrl+T');
    Driver.log("waitUntilReduxState!");
    await Driver.waitUntilReduxState(currentState =>
      currentState.pages.currentPageIndex === 1 &&
      currentState.pages.pages.length === 2);
    Driver.log("waitUntilReduxState!");

    Driver.ipcSendToMain('synthesize-accelerator', 'CmdOrCtrl+Alt+Left');
    Driver.log("waitUntilReduxState!");
    await Driver.waitUntilReduxState(currentState =>
      currentState.pages.currentPageIndex === 0);
    Driver.log("waitUntilReduxState!");

    Driver.ipcSendToMain('synthesize-accelerator', 'CmdOrCtrl+Alt+Right');
    Driver.log("waitUntilReduxState!");
    await Driver.waitUntilReduxState(currentState =>
      currentState.pages.currentPageIndex === 1);
    Driver.log("waitUntilReduxState!");

    Driver.ipcSendToRenderer('close-tab');
    Driver.log("waitUntilReduxState!");
    await Driver.waitUntilReduxState(currentState =>
      currentState.pages.pages.length === STARTING_TAB_COUNT &&
      currentState.pages.currentPageIndex === 0);
    Driver.log("waitUntilReduxState!");
  });
});
