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

import * as profileCommandTypes from './constants/profile-command-types';

/**
 * The command for the '✫' bookmark button.
 */
export function bookmark(url, title) {
  return { type: profileCommandTypes.SET_BOOKMARK_STATE,
    payload: { url, isBookmarked: true, title } };
}

/**
 * The command for undoing the '✫' bookmark button.
 */
export function unbookmark(url) {
  return { type: profileCommandTypes.SET_BOOKMARK_STATE,
    payload: { url, isBookmarked: false } };
}

export function visited(url) {
  return { type: profileCommandTypes.VISITED, payload: { url } };
}

export function setUserTypedLocation(text) {
  return {
    type: profileCommandTypes.SET_USER_TYPED_LOCATION,
    payload: {
      text,
    },
  };
}
