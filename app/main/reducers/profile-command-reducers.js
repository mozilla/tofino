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

import electron from 'electron';
import Immutable from 'immutable';

import * as profileCommandTypes from '../../shared/constants/profile-command-types';
import * as profileActions from '../actions/profile-actions';
import { ProfileStorage } from '../../services/storage';

export default async function commandHandler(
    storage: ProfileStorage,
    dispatch: any,
    browserWindow: ?electron.BrowserWindow,
    makeBrowserWindow: () => Promise<electron.BrowserWindow>,
    command: profileActions.ProfileAction): Promise<void> {
  console.log(`profile-command-reducers.js: Reducing ${JSON.stringify(command)}`);

  async function dispatchActionsForChangedStarred(
    url: string     // eslint-disable-line no-unused-vars
  ) {
    // TODO: only send add/remove starredness for `url`, rather than grabbing the whole set.
    const bookmarkSet = await storage.starred();
    dispatch(profileActions.bookmarkSet(new Immutable.Set(bookmarkSet)));

    const recentList = await storage.recentlyStarred();
    dispatch(profileActions.recentBookmarks(new Immutable.List(recentList)));
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
        dispatch(profileActions.topSites(new Immutable.List()));
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
        await dispatchActionsForChangedStarred(payload.url);
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
        await dispatchActionsForChangedStarred(payload.url);
      } catch (e) {
        console.log(e); // TODO: do more than ignore failure.
      }
      break;

    case profileCommandTypes.DID_SET_USER_TYPED_LOCATION:
      try {
        const completions = await storage.visitedMatches(payload.text);
        dispatch(profileActions.completionsFor(payload.text, new Immutable.List(completions)));
      } catch (e) {
        console.log(e); // TODO: do more than ignore failure.
      }
      break;

    case profileCommandTypes.DID_CLOSE_BROWSER_WINDOW:
      if (!browserWindow) {
        break;
      }
      dispatch(profileActions.closeBrowserWindow(browserWindow));
      break;

    case profileCommandTypes.DID_OPEN_NEW_BROWSER_WINDOW:
      dispatch(profileActions.createBrowserWindow(await makeBrowserWindow()));
      break;

    default:
      break;
  }
}
