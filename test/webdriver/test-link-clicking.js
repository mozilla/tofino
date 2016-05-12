// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/* eslint prefer-arrow-callback: 0 */

import expect from 'expect';
import { quickTest } from '../../build-config';
import Driver from '../utils/driver';
import * as selectors from '../../app/ui/browser/selectors/index';

describe('link clicking', function() {
  if (quickTest) {
    it.skip('all tests');
    return;
  }

  this.timeout(Driver.TEST_TIMEOUT_IN_MS);

  /**
   * These tests all run in the same browser cycle, so ensure tests are cleaned up properly!
   */
  before(async function() {
    await Driver.start();
  });

  after(async function() {
    await Driver.stop();
  });

  it('can click a link in a page', async function() {
    const initialState = await Driver.getReduxState();
    expect(selectors.getPages(initialState).length).toEqual(1, 'Have one tab to start.');

    await Driver.blur();
    await Driver.navigate(`${Driver.fixturesURL}/links.html`);
    await Driver.waitForCurrentTabLoaded();
    expect(true).toBe(true, 'Navigated to links.html');

    await Driver.setTargetByURL(`${Driver.fixturesURL}/links.html`);
    await Driver.client.click('#this-tab');

    const text = await Driver.client.getText('#hello');
    expect(text).toEqual('Hello');

    // Clean up by killing a tab.  Be careful to select a WebDriver window handle other than the
    // tab hosting the current WebDriver target; WD doesn't like that!
    await Driver.setTargetToBrowserWindow();
    Driver.ipcSendToMain('synthesize-accelerator', 'CmdOrCtrl+W');

    await Driver.waitUntilReduxState(currentState =>
                                     selectors.getPages(currentState).length ===
                                     selectors.getPages(initialState).length);
  });

  it('can click (modified) a link in a page and open a background tab', async function() {
    const initialState = await Driver.getReduxState();
    expect(selectors.getPages(initialState).length).toEqual(1, 'Have one tab to start.');

    await Driver.blur();
    await Driver.navigate(`${Driver.fixturesURL}/links.html`);
    await Driver.waitForCurrentTabLoaded();
    expect(true).toBe(true, 'Navigated to links.html');

    await Driver.setTargetByURL(`${Driver.fixturesURL}/links.html`);
    await Driver.client.keys('Alt').click('#this-tab').keys('NULL');

    await Driver.waitUntilReduxState(currentState =>
                                     selectors.getPages(currentState).length ===
                                     selectors.getPages(initialState).length + 1);

    const state = await Driver.getReduxState();
    expect(selectors.getPages(state).length).toEqual(selectors.getPages(initialState).length + 1,
                                                     'Got a new page');

    expect(selectors.getCurrentPageIndex(state))
      .toEqual(selectors.getCurrentPageIndex(initialState),
               'New page is not selected');

    // Clean up by killing two tabs.  A new tab will be created, which helps subsequent
    // navigations.  Be careful to select a WebDriver window handle other than the tab hosting
    // the current WebDriver target; WD doesn't like that!
    await Driver.setTargetToBrowserWindow();
    Driver.ipcSendToMain('synthesize-accelerator', 'CmdOrCtrl+W');
    Driver.ipcSendToMain('synthesize-accelerator', 'CmdOrCtrl+W');

    await Driver.waitUntilReduxState(currentState =>
                                     selectors.getPages(currentState).length ===
                                     selectors.getPages(initialState).length);
  });

  it('can click a link with target="_blank" in a page and open a foreground tab', async function() {
    const initialState = await Driver.getReduxState();
    expect(selectors.getPages(initialState).length).toEqual(1, 'Have one tab to start.');

    await Driver.blur();
    await Driver.navigate(`${Driver.fixturesURL}/links.html`);
    await Driver.waitForCurrentTabLoaded();
    expect(true).toBe(true, 'Navigated to links.html');

    await Driver.setTargetByURL(`${Driver.fixturesURL}/links.html`);
    await Driver.client.click('#background-tab');

    await Driver.waitUntilReduxState(currentState =>
                                     selectors.getPages(currentState).length ===
                                     selectors.getPages(initialState).length + 1);

    const state = await Driver.getReduxState();
    expect(selectors.getPages(state).length).toEqual(selectors.getPages(initialState).length + 1,
                                                     'Got a new page');

    expect(selectors.getCurrentPageIndex(state))
      .toEqual(selectors.getCurrentPageIndex(initialState) + 1,
               'New page is selected');

    // Clean up by killing a tab.  Be careful to select a WebDriver window handle other than the
    // tab hosting the current WebDriver target; WD doesn't like that!
    await Driver.setTargetToBrowserWindow();
    Driver.ipcSendToMain('synthesize-accelerator', 'CmdOrCtrl+W');

    await Driver.waitUntilReduxState(currentState =>
                                     selectors.getPages(currentState).length ===
                                     selectors.getPages(initialState).length);
  });
});
