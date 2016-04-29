// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/* eslint no-console: 0 */

import { ProfileStorage } from '../../../app/services/storage';
import * as model from '../../../app/model/index';
import * as storeStore from '../../../app/main/store/store';
import * as profileCommandHandler from '../../../app/main/profile-command-handler';
import * as profileCommands from '../../../app/shared/profile-commands';

import expect from 'expect';
import fs from 'fs';
import Immutable from 'immutable';
import path from 'path';
import tmp from 'tmp';

expect.extend({
  toIs(other) {
    expect.assert(
      Immutable.is(this.actual, other),
      'expected %s to Immutable.is %s',
      this.actual,
      other,
    );
    return this;
  },
});

describe('profile-command-handler', () => {
  let tempDir: string;
  let storage: ProfileStorage;
  let sessionId: number;
  let store: any;

  beforeEach(async function() {
    tempDir = tmp.dirSync({}).name;
    storage = await ProfileStorage.open(tempDir);
    sessionId = await storage.startSession();
    store = storeStore.configureStore(new model.UserAgent());
  });

  afterEach(async function() {
    await storage.close();

    // This should be the only file after we close.
    fs.unlinkSync(path.join(tempDir, 'browser.db'));
    fs.rmdirSync(tempDir);
  });

  it('handles bookmark and unbookmark profile commands', async function () {
    let newState = store.getState();
    newState = await profileCommandHandler.handler(
      newState, storage, { sessionId }, () => null,
      profileCommands.bookmark('http://moz1.com', 'title'));
    newState = await profileCommandHandler.handler(
      newState, storage, { sessionId }, () => null,
      profileCommands.bookmark('http://moz2.com', 'title'));
    expect(newState.bookmarks).toIs(new Immutable.Set(['http://moz1.com', 'http://moz2.com']));
    expect(newState.recentBookmarks.map((b) => b.location))
      .toIs(new Immutable.List(['http://moz2.com', 'http://moz1.com']));

    newState = await profileCommandHandler.handler(
      newState, storage, { sessionId }, () => null,
      profileCommands.unbookmark('http://moz2.com', 'title'));
    expect(newState.bookmarks).toIs(new Immutable.Set(['http://moz1.com']));
    expect(newState.recentBookmarks.map((b) => b.location))
      .toIs(new Immutable.List(['http://moz1.com']));
  });

  it('handles new and close browser window profile commands', async function () {
    let newState = store.getState();
    newState = await profileCommandHandler.handler(
      newState, storage, { sessionId }, () => ({ id: 11 }),
      profileCommands.newBrowserWindow());
    newState = await profileCommandHandler.handler(
      newState, storage, { sessionId }, () => ({ id: 22 }),
      profileCommands.newBrowserWindow());
    expect(newState.browserWindows).toIs(new Immutable.Set([11, 22]));

    newState = await profileCommandHandler.handler(
      newState, storage, { sessionId, id: 11 }, () => ({ id: 33 }),
      profileCommands.closeBrowserWindow());
    expect(newState.browserWindows).toIs(new Immutable.Set([22]));
  });
});
