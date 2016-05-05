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
  let scope: number;
  let sessionId: number;
  let store: any;

  beforeEach(async function() {
    tempDir = tmp.dirSync({}).name;
    if (!tempDir) {
      throw new Error('could not create tempDir');
    }
    storage = await ProfileStorage.open(tempDir);
    scope = await storage.startSession();
    sessionId = await storage.startSession(scope);
    store = storeStore.configureStore(new model.UserAgent());
  });

  afterEach(async function() {
    await storage.close();

    // This should be the only file after we close.
    fs.unlinkSync(path.join(tempDir, 'browser.db'));
    fs.rmdirSync(tempDir);
  });

  it('Handles save-page commands.', async function () {
    const reader = {
      uri: 'http://example.com',
      title: 'The Éxample',
      content: '<html><head><h1>Header</h1><p>Content goes here</p></head></html>',

      // textContent is trimmed upstream.
      textContent: `Header

Content goes here`,
      length: 123,
      excerpt: 'Content goes here',
    };

    const startState = store.getState();
    const nextState = await profileCommandHandler.handler(
      startState, storage, { scope }, () => null,
      undefined,
      profileCommands.savePage(sessionId, reader)
    );

    // The state doesn't change.
    expect(nextState).toIs(startState);

    // But we stored the document.
    const row = await storage.db.get('SELECT title, excerpt, content FROM pages');
    expect(row).toExist();
    expect(row.title).toEqual('The Éxample');
    expect(row.excerpt).toEqual('Content goes here');
    expect(row.content).toEqual('Header\n\nContent goes here');
  });

  it('handles bookmark and unbookmark profile commands', async function () {
    let newState = store.getState();
    newState = await profileCommandHandler.handler(
      newState, storage, { scope }, () => null,
      undefined,
      profileCommands.bookmark(sessionId, 'http://moz1.com', 'title'));
    newState = await profileCommandHandler.handler(
      newState, storage, { scope }, () => null,
      undefined,
      profileCommands.bookmark(sessionId, 'http://moz2.com', 'title'));
    expect(newState.bookmarks).toIs(new Immutable.Set(['http://moz1.com', 'http://moz2.com']));
    expect(newState.recentBookmarks.map((b) => b.location))
      .toIs(new Immutable.List(['http://moz2.com', 'http://moz1.com']));

    newState = await profileCommandHandler.handler(
      newState, storage, { scope }, () => null,
      undefined,
      profileCommands.unbookmark(sessionId, 'http://moz2.com', 'title'));
    expect(newState.bookmarks).toIs(new Immutable.Set(['http://moz1.com']));
    expect(newState.recentBookmarks.map((b) => b.location))
      .toIs(new Immutable.List(['http://moz1.com']));
  });

  it('handles new and close browser window profile commands', async function () {
    let newState = store.getState();
    newState = await profileCommandHandler.handler(
      newState, storage, { scope }, () => ({ id: 11 }),
      undefined,
      profileCommands.newBrowserWindow());
    newState = await profileCommandHandler.handler(
      newState, storage, { scope }, () => ({ id: 22 }),
      undefined,
      profileCommands.newBrowserWindow());
    expect(newState.browserWindows).toIs(new Immutable.Set([11, 22]));

    newState = await profileCommandHandler.handler(
      newState, storage, { scope, id: 11 }, () => ({ id: 33 }),
      undefined,
      profileCommands.closeBrowserWindow());
    expect(newState.browserWindows).toIs(new Immutable.Set([22]));
  });

  it('handles start session profile commands', async function () {
    let newState = store.getState();
    const response = await new Promise((resolve, _reject) => {
      newState = profileCommandHandler.handler(
        newState, storage, { scope }, () => ({ id: 11 }),
        (r) => resolve(r.payload),
        profileCommands.startSession(sessionId));
    });
    expect(response).toExist();
    expect(response.sessionId).toBeA('number');
    expect(response.ancestorId).toEqual(sessionId);
  });

  it('handles end session profile commands', async function () {
    let newState = store.getState();
    const response = await new Promise((resolve, _reject) => {
      newState = profileCommandHandler.handler(
        newState, storage, { scope }, () => ({ id: 11 }),
        (r) => resolve(r.payload),
        profileCommands.endSession(sessionId));
    });
    expect(response).toExist();
    expect(response.sessionId).toEqual(sessionId);
  });
});
