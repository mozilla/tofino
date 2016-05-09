/* @flow */

/*
 Copyright 2016 Mozilla

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use
 this file except in compliance with the License. You may obtain a copy of the
 License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed
 under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 CONDITIONS OF ANY KIND, either express or implied. See the License for the
 specific language governing permissions and limitations under the License.
 */

/* eslint no-console: 0 */

import assert from 'assert';

import type { BrowserWindow } from 'electron';
import Immutable from 'immutable';

import * as model from '../model';
import * as profileDiffs from '../shared/profile-diffs';
import * as profileDiffTypes from '../shared/constants/profile-diff-types';
import * as profileCommands from '../shared/profile-commands';
import * as profileCommandTypes from '../shared/constants/profile-command-types';
import { ProfileStorage } from '../services/storage';

export async function handler(
  userAgent: model.UserAgent,
  storage: ProfileStorage,
  browserWindow: ?BrowserWindow,
  makeBrowserWindow: () => Promise<BrowserWindow>,
  respond: ?((response: any) => any),
  command: profileCommands.ProfileCommand): Promise<model.UserAgent> {
  async function dispatchActionsForChangedStarred(
    url: string     // eslint-disable-line no-unused-vars
  ): Promise<model.UserAgent> {
    // TODO: only send add/remove starredness for `url`, rather than grabbing the whole set.
    const bookmarks = await storage.starredURLs();
    const recentBookmarks = await storage.recentlyStarred();

    return userAgent
      .set('bookmarks', bookmarks)
      .set('recentBookmarks', new Immutable.List(recentBookmarks));
  }

  async function startSession(scope: number, payload: Object = {}): Promise<void> {
    const { ancestorId } = payload;
    const sessionId = await storage.startSession(scope, ancestorId);
    if (respond) {
      respond({ payload: { sessionId, ancestorId } });
    }
  }

  async function endSession(payload: Object = {}): Promise<void> {
    const { sessionId } = payload;
    assert(sessionId, 'Cannot end a session with an undefined sessionId.');
    try {
      await storage.endSession(sessionId);
      if (respond) {
        respond({ payload: { sessionId } });
      }
    } catch (e) {
      if (respond) {
        respond({ error: true, payload: e });
      }
    }
  }

  const payload = command.payload;
  switch (command.type) {
    case profileCommandTypes.DID_VISIT_LOCATION:
      try {
        // TODO: include visit types.
        await storage.visit(payload.url, payload.sessionId, payload.title);

        // TODO: actually fetch top sites.
        return userAgent.set('visits', new Immutable.List());
      } catch (e) {
        // TODO: do more than ignore failure to persist visit.
      }
      break;

    case profileCommandTypes.DID_BOOKMARK_LOCATION:
      try {
        await storage.starPage(payload.url, payload.sessionId, +1);
        return await dispatchActionsForChangedStarred(payload.url);
      } catch (e) {
        console.log(e); // TODO: do more than ignore failure.
      }
      break;

    case profileCommandTypes.DID_UNBOOKMARK_LOCATION:
      try {
        await storage.starPage(payload.url, payload.sessionId, -1);
        return await dispatchActionsForChangedStarred(payload.url);
      } catch (e) {
        console.log(e); // TODO: do more than ignore failure.
      }
      break;

    case profileCommandTypes.DID_SET_USER_TYPED_LOCATION:
      if (respond) {
        try {
          const results = await storage.query(payload.text);
          respond(profileDiffs.completions(payload.text, results));
        } catch (e) {
          respond({ type: profileDiffTypes.COMPLETIONS, error: true, payload: e });
        }
      }
      break;

    case profileCommandTypes.DID_CLOSE_BROWSER_WINDOW:
      if (!browserWindow) {
        break;
      }
      return userAgent.set('browserWindows',
        userAgent.browserWindows.delete(browserWindow.id));

    case profileCommandTypes.DID_OPEN_NEW_BROWSER_WINDOW:
      return userAgent.set('browserWindows',
        userAgent.browserWindows.add((await makeBrowserWindow(payload.tabInfo)).id));

    case profileCommandTypes.DID_REQUEST_SAVE_PAGE:
      console.log(`Saving ${payload.page.uri} at ${Date.now()}.`);
      console.log(`Saving: ${payload.page.textContent}`);
      await storage.savePage(payload.page, payload.sessionId);
      break;

    case profileCommandTypes.DID_START_SESSION:
      if (browserWindow) {
        await startSession(browserWindow.scope, payload);
      } else {
        if (respond) {
          respond({ error: true, payload: 'browserWindow must be defined' });
        }
      }
      break;

    case profileCommandTypes.DID_END_SESSION:
      await endSession(payload);
      break;

    default:
      console.log(`Don't recognize type ${command.type}.`);
      break;
  }

  return userAgent;
}
