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

  this.timeout(Driver.TEST_TIMEOUT_IN_MS);

  beforeEach(async function() {
    await Driver.start();
  });

  afterEach(async function() {
    await Driver.stop();
  });

  it('can navigate back and forward in a page', async function() {
    await Driver.navigate(`${Driver.fixturesURL}/simple.html`);
    await Driver.waitForCurrentTabLoaded();
    expect(true).toBe(true, 'Navigated to simple.html');

    await Driver.blur();
    await Driver.client.waitForText('#browser-location-title-bar > span',
      'A Very Simple Page');
    expect(true).toBe(true, 'Got updated title bar text');
    await Driver.waitForURLValue(`${Driver.fixturesURL}/simple.html`);
    expect(true).toBe(true, 'Got updated url value');

    await Driver.navigate(`${Driver.fixturesURL}/mozilla.html`);
    await Driver.waitForCurrentTabLoaded();
    expect(true).toBe(true, 'Navigated to mozilla.html');

    await Driver.blur();
    await Driver.client.waitForText('#browser-location-title-bar > span',
      'The Book of Mozilla, 15:1');
    await Driver.waitForURLValue(`${Driver.fixturesURL}/mozilla.html`);
    expect(true).toBe(true, 'Got updated url value');

    await Driver.navigateBack();
    await Driver.client.waitForText('#browser-location-title-bar > span',
      'A Very Simple Page');
    expect(true).toBe(true, 'Navigated back to simple.html');

    await Driver.navigateForward();
    await Driver.client.waitForText('#browser-location-title-bar > span',
      'The Book of Mozilla, 15:1');
    expect(true).toBe(true, 'Navigated forward to mozilla.html');
  });

  it('updates display title when navigating via HTML5 history', async function() {
    await Driver.navigate(`${Driver.fixturesURL}/history.html`);
    await Driver.waitForCurrentTabLoaded();

    await Driver.setTargetByURL(`${Driver.fixturesURL}/history.html`);
    await Driver.client.click('#red');
    await checkTitle('red');

    await Driver.setTargetByURL(`${Driver.fixturesURL}/red.html`);
    await Driver.client.click('#blue');
    await checkTitle('blue');

    await Driver.setTargetByURL(`${Driver.fixturesURL}/blue.html`);
    await Driver.client.click('#no-title');
    await checkTitle('blue');

    await Driver.navigateBack();
    await checkTitle('blue');
    await Driver.navigateBack();
    await checkTitle('red');

    async function checkTitle(expected) {
      await Driver.setTargetToBrowserWindow();
      await Driver.blur();
      await Driver.client.waitForText('#browser-location-title-bar > span', expected);
    }
  });
});
