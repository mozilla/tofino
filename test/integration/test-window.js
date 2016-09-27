// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/* global BW, userAgentClient */

import { awaitEvent } from './utils';

describe('browser window', function() {
  it('opened window should have no errors', async function() {
    const bw = await BW.createBrowserWindow(userAgentClient);
    const err = await awaitEvent(bw, 'window-ready');
    if (err) {
      throw err;
    }
  });
});
