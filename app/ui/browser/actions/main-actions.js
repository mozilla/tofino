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
import { Page } from '../model';
import * as profileCommands from '../../../shared/profile-commands';
import { ipcRenderer } from '../../../shared/electron';

export function createTab(location) {
  const page = location ? new Page({ location }) : new Page();
  return { type: types.CREATE_TAB, page, instrument: true };
}

export function duplicateTab(pageId) {
  return { type: types.DUPLICATE_TAB, pageId, instrument: true };
}
export function attachTab(page) {
  page = new Page(page);
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

export function setPageOrder(pageId, updatedIndex) {
  return { type: types.SET_PAGE_ORDER, pageId, updatedIndex, instrument: true };
}

export function setPageAreaVisibility(visible) {
  return { type: types.SET_PAGE_AREA_VISIBILITY, visible };
}

export function setUserTypedLocation(pageId, payload) {
  return dispatch => {
    // Update this window's state before telling the profile service.
    dispatch({ type: types.SET_USER_TYPED_LOCATION, pageId, payload, instrument: false });

    // Only send request to profile service if there's a non-empty input.
    // Empty input could happen if a page finishes loading and the userTyped
    // state is going to be reset.
    if (payload.text) {
      ipcRenderer.send('profile-command', profileCommands.setUserTypedLocation(payload.text));
    }
  };
}

export function bookmark(url, title) {
  return dispatch => {
    // Update this window's state before telling the profile service.
    dispatch({ type: types.SET_BOOKMARK_STATE, url, isBookmarked: true, title });

    ipcRenderer.send('profile-command', profileCommands.bookmark(url, title));
  };
}

export function unbookmark(url) {
  return dispatch => {
    // Update this window's state before telling the profile service.
    dispatch({ type: types.SET_BOOKMARK_STATE, url, isBookmarked: false });

    ipcRenderer.send('profile-command', profileCommands.unbookmark(url));
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
