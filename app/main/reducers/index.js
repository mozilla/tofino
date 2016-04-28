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

import * as model from '../../model';
import * as profileActionTypes from '../constants/profile-action-types';

export default function rootReducer(userAgent: model.UserAgent = new model.UserAgent(),
  action: Object): model.UserAgent {
  const payload = action.payload;
  switch (action.type) {
    case profileActionTypes.DID_CHANGE_BOOKMARKS:
      return userAgent.set('bookmarks', payload);

    case profileActionTypes.DID_CHANGE_RECENT_BOOKMARKS:
      return userAgent.set('recentBookmarks', payload);

    case profileActionTypes.DID_CREATE_BROWSER_WINDOW:
      return userAgent.set('browserWindows',
        userAgent.browserWindows.add(payload.browserWindow.id));

    case profileActionTypes.DID_CLOSE_BROWSER_WINDOW:
      return userAgent.set('browserWindows',
        userAgent.browserWindows.delete(payload.browserWindow.id));

    case profileActionTypes.DID_SET_TOP_SITES_LIST:
      return userAgent.set('visits', payload);

    case profileActionTypes.DID_SET_COMPLETION_LIST_FOR:
      return userAgent.set('locations',
        userAgent.locations.set(payload.text, payload.completionList));

    default:
      return userAgent;
  }
}
