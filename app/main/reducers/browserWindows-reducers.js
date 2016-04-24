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

import * as profileActionTypes from '../constants/profile-action-types';

import Immutable from 'immutable';

/**
 * Set of known BrowserWindow IDs.
 *
 * We diff the current and previous state.  However, after a BrowserWindow is closed, its ID
 * property is no longer available.  (The error will say "Object has been destroyed".)  Therefore,
 * to allow to compare to a previous state with a BrowserWindow that is no longer alive, we maintain
 * a set of known BrowserWindow IDs and take care to not fetch the ID of closed windows.
 */
type State = Immutable.Set<number>;

export default function browserWindowsReducer(state: State = new Immutable.Set(),
                                              action: Object): State {
  const payload = action.payload;
  switch (action.type) {
    case profileActionTypes.DID_CREATE_BROWSER_WINDOW:
      return state.add(payload.browserWindow.id);

    case profileActionTypes.DID_CLOSE_BROWSER_WINDOW:
      return state.delete(payload.browserWindow.id);

    default:
      return state;
  }
}
