/* eslint prefer-arrow-callback: 0 */

import path from 'path';
import expect from 'expect';
import { Application } from 'spectron';
import * as BuildUtils from '../../build/utils';
import { quickTest } from '../../build-config';

const root = path.join(__dirname, '..', '..');
const command = BuildUtils.getElectronPath();

describe('application launch', function() {
  if (quickTest) {
    it.skip('all tests');
    return;
  }

  this.timeout(10000);

  beforeEach(async function() {
    this.app = new Application({
      path: command,
      args: [root],
      env: process.env,
      cwd: root,
    });
    return this.app.start();
  });

  it('shows an initial window', async function() {
    const count = await this.app.client.getWindowCount();
    expect(count).toEqual(1);
  });

  afterEach(function() {
    if (this.app && this.app.isRunning()) {
      return this.app.stop();
    }
    return undefined;
  });
});
