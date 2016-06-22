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
import { Profile } from '../model/browser';
import * as types from '../constants/action-types';
import * as profileDiffTypes from '../../../shared/constants/profile-diff-types';

const initialState = new Profile();

export default function profile(state = initialState, action) {
  switch (action.type) {
    case types.SET_BOOKMARK_STATE:
      return setBookmarkState(state, action.url, action.isBookmarked);

    case profileDiffTypes.BOOKMARKS:
      return setBookmarks(state, Immutable.Set(action.payload));

    case profileDiffTypes.COMPLETIONS:
      return setCompletion(state, action.payload.text, action.payload.completionList);

    default:
      return state;
  }
}

function setBookmarkState(state, url, isBookmarked) {
  return state.set('bookmarks', isBookmarked
    ? state.bookmarks.add(url)
    : state.bookmarks.delete(url));
}

function setBookmarks(state, bookmarks) {
  return state.set('bookmarks', bookmarks);
}

function setCompletion(state, text, completionList) {
  return state.set('completions', state.completions.set(text, completionList));
}
