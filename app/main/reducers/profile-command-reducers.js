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

import Immutable from 'immutable';

import * as profileCommandTypes from '../../shared/constants/profile-command-types';
import * as profileActions from '../actions/profile-actions';
import { ProfileStorage } from '../../services/storage';

export default async function commandHandler(storage: ProfileStorage,
                                             dispatch: any,
                                             sessionId: number,
                                             command: profileActions.ProfileAction): Promise<void> {
  console.log(`${sessionId}: Reducing ${JSON.stringify(command)}`);

  const payload = command.payload;
  switch (command.type) {
    case profileCommandTypes.DID_VISIT_LOCATION:
      try {
        await storage.visit(payload.url, sessionId, payload.title);
        dispatch(profileActions.topSites(new Immutable.List()));
      } catch (e) {
        // TODO: do more than ignore failure to persist visit.
      }
      break;

    case profileCommandTypes.DID_BOOKMARK_LOCATION:
      try {
        await storage.starPage(payload.url, sessionId, +1);
        const bookmarkSet = await storage.starred();
        dispatch(profileActions.bookmarkSet(new Immutable.Set(bookmarkSet)));
      } catch (e) {
        console.log(e); // TODO: do more than ignore failure.
      }
      break;

    case profileCommandTypes.DID_UNBOOKMARK_LOCATION:
      try {
        await storage.starPage(payload.url, sessionId, -1);
        const bookmarkSet = await storage.starred();
        dispatch(profileActions.bookmarkSet(new Immutable.Set(bookmarkSet)));
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

    default:
      break;
  }
}
