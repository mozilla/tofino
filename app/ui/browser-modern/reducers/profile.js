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

import Immutable from 'immutable';

import Profile from '../model/profile';
import * as ActionTypes from '../constants/action-types';
import * as ProfileDiffTypes from '../../../shared/constants/profile-diff-types';

export default function(state = new Profile(), action) {
  switch (action.type) {

    // Actions coming from the profile service.

    case ProfileDiffTypes.BOOKMARKS:
      return setBookmarks(state, action.payload);

    // Actions dispatched by the frontend.

    case ActionTypes.SET_LOCAL_BOOKMARK_STATE:
      return setLocalBookmarkState(state, action.url, action.bookmarked);

    default:
      return state;
  }
}

function setBookmarks(state, bookmarks) {
  return state.set('bookmarks', Immutable.Set(bookmarks));
}

function setLocalBookmarkState(state, url, bookmarked) {
  return state.set('bookmarks', bookmarked
    ? state.bookmarks.add(url)
    : state.bookmarks.delete(url));
}
