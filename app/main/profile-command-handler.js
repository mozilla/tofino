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

  const payload = command.payload;
  switch (command.type) {
    case profileCommandTypes.DID_VISIT_LOCATION:
      try {
        if (!browserWindow || !browserWindow.sessionId) {
          break;
        }

        // TODO: include visit types.
        await storage.visit(payload.url, browserWindow.sessionId, payload.title);

        // TODO: actually fetch top sites.
        return userAgent.set('visits', new Immutable.List());
      } catch (e) {
        // TODO: do more than ignore failure to persist visit.
      }
      break;

    case profileCommandTypes.DID_BOOKMARK_LOCATION:
      try {
        if (!browserWindow || !browserWindow.sessionId) {
          break;
        }
        await storage.starPage(payload.url, browserWindow.sessionId, +1);
        return await dispatchActionsForChangedStarred(payload.url);
      } catch (e) {
        console.log(e); // TODO: do more than ignore failure.
      }
      break;

    case profileCommandTypes.DID_UNBOOKMARK_LOCATION:
      try {
        if (!browserWindow || !browserWindow.sessionId) {
          break;
        }
        await storage.starPage(payload.url, browserWindow.sessionId, -1);
        return await dispatchActionsForChangedStarred(payload.url);
      } catch (e) {
        console.log(e); // TODO: do more than ignore failure.
      }
      break;

    case profileCommandTypes.DID_SET_USER_TYPED_LOCATION:
      if (respond) {
        try {
          const completions = await storage.visitedMatches(payload.text);
          respond(profileDiffs.completions(payload.text, completions));
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
      if (!browserWindow || !browserWindow.sessionId) {
        break;
      }
      console.log(`Saving ${payload.uri} at ${Date.now()}.`);
      console.log(`Saving: ${payload.textContent}`);
      await storage.savePage(payload, browserWindow.sessionId);
      break;

    default:
      console.log(`Don't recognize type ${command.type}.`);
      break;
  }

  return userAgent;
}
