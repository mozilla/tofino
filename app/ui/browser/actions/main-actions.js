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

import * as types from '../constants/action-types';
import * as profileDiffs from '../../../shared/profile-diffs';
import * as profileCommands from '../../../shared/profile-commands';

export function createTab(location) {
  return { type: types.CREATE_TAB, location, instrument: true };
}

export function attachTab(page) {
  return { type: types.ATTACH_TAB, page, instrument: true };
}

export function closeTab(pageId) {
  return { type: types.CLOSE_TAB, pageId, instrument: true };
}

export function setPageDetails(pageId, payload) {
  return { type: types.SET_PAGE_DETAILS, pageId, payload, instrument: false };
}

export function setCurrentTab(pageId) {
  return { type: types.SET_CURRENT_TAB, pageId, instrument: true };
}

export function setStatusText(text) {
  return { type: types.SET_STATUS_TEXT, text };
}

export function setUserTypedLocation(pageId, payload) {
  return (dispatch) => {
    // Update this window's state before telling the profile service.
    dispatch({ type: types.SET_USER_TYPED_LOCATION, pageId, payload, instrument: false });

    // Only send request to profile service if there's a non-empty input.
    // Empty input could happen if a page finishes loading and the userTyped
    // state is going to be reset.
    if (payload.text) {
      profileCommands.request(profileCommands.setUserTypedLocation(payload.text))
        .then(({ text, completionList }) => {
          dispatch(profileDiffs.completions(text, completionList));
        })
        .catch(console.warn); // Ignore failures.  Not much to be done here.
    }
  };
}

export function bookmark(url, title) {
  return dispatch => {
    // Update this window's state before telling the profile service.
    dispatch({ type: types.SET_BOOKMARK_STATE, url, isBookmarked: true, title });

    profileCommands.send(profileCommands.bookmark(url, title));
  };
}

export function unbookmark(url) {
  return dispatch => {
    // Update this window's state before telling the profile service.
    dispatch({ type: types.SET_BOOKMARK_STATE, url, isBookmarked: false });

    profileCommands.send(profileCommands.unbookmark(url));
  };
}

export function navigatePageTo(pageId, location) {
  return { type: types.NAVIGATE_PAGE_TO, pageId, location };
}

export function navigatePageBack(pageId) {
  return { type: types.NAVIGATE_PAGE_BACK, pageId };
}

export function navigatePageForward(pageId) {
  return { type: types.NAVIGATE_PAGE_FORWARD, pageId };
}

export function navigatePageRefresh(pageId) {
  return { type: types.NAVIGATE_PAGE_REFRESH, pageId };
}
