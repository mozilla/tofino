// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/
/* eslint prefer-arrow-callback: 0 */

import expect from 'expect';
import { quickTest } from '../../build-config';
import Driver from '../utils/driver';

describe('navigation', function() {
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

  it('can navigate back and forward in a page', async function() {
    await Driver.navigate(`http://localhost:${Driver.port}/simple.html`);
    await Driver.waitForCurrentTabLoaded();
    expect(true).toBe(true, 'Navigated to simple.html');

    await Driver.blur();
    await Driver.app.client.waitForText('#browser-location-title-bar > span',
      'A Very Simple Page');
    expect(true).toBe(true, 'Got updated title bar text');

    await Driver.navigate(`http://localhost:${Driver.port}/mozilla.html`);
    await Driver.waitForCurrentTabLoaded();
    expect(true).toBe(true, 'Navigated to mozilla.html');

    await Driver.blur();
    await Driver.app.client.waitForText('#browser-location-title-bar > span',
      'The Book of Mozilla, 15:1');

    await Driver.navigateBack();
    await Driver.app.client.waitForText('#browser-location-title-bar > span',
      'A Very Simple Page');
    expect(true).toBe(true, 'Navigated back to simple.html');

    await Driver.navigateForward();
    await Driver.app.client.waitForText('#browser-location-title-bar > span',
      'The Book of Mozilla, 15:1');
    expect(true).toBe(true, 'Navigated forward to mozilla.html');
  });
});
