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
    let { value: elements } = await Driver.client.elements('#browser-tabbar .tab');
    expect(elements.length).toBe(1);

    Driver.ipcSendToMain('synthesize-accelerator', 'CmdOrCtrl+T');

    await Driver.client.waitUntil(() =>
      Driver.client.elements('#browser-tabbar .tab').then(({ value }) => value.length === 2));

    ({ value: elements } = await Driver.client.elements('#browser-tabbar .tab'));
    expect(elements.length).toBe(2);

    // Clean up and close a tab (doesn't matter which one in this case)
    await Driver.click('#browser-tabbar .tab-close');
    await Driver.client.waitUntil(() =>
      Driver.client.elements('#browser-tabbar .tab').then(({ value }) => value.length === 1));
  });
});
