/* eslint prefer-arrow-callback: 0 */

import expect from 'expect';
import { Application } from 'spectron';
import { quickTest } from '../../build-config';
import { getBuiltExecutable } from '../../build/utils';

describe('application launch', function() {
  if (quickTest) {
    it.skip('all tests');
    return;
  }

  this.timeout(20000);
  const executable = getBuiltExecutable();

  beforeEach(function() {
    this.app = new Application({
      path: executable.fullPath,
      cwd: executable.cwd,
      env: process.env,
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
