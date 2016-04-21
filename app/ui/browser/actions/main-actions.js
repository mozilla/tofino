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
import * as profileCommands from '../../../shared/profile-commands';

// Stub out ipcRenderer when electron cannot be found (unit tests)
const ipcRenderer = (function() {
  try {
    return require('electron').ipcRenderer;
  } catch (e) {
    return { send() {} };
  }
}());

export function createTab(location) {
  return { type: types.CREATE_TAB, location, instrument: true };
}

export function duplicateTab(pageIndex) {
  return { type: types.DUPLICATE_TAB, pageIndex, instrument: true };
}
export function attachTab(page) {
  return { type: types.ATTACH_TAB, page, instrument: true };
}

export function closeTab(pageIndex) {
  return { type: types.CLOSE_TAB, pageIndex, instrument: true };
}

export function setPageDetails(payload) {
  return { type: types.SET_PAGE_DETAILS, payload, instrument: false };
}

export function setCurrentTab(pageIndex) {
  return { type: types.SET_CURRENT_TAB, pageIndex, instrument: true };
}

export function setPageOrder(pageIndex, updatedIndex) {
  return { type: types.SET_PAGE_ORDER, pageIndex, updatedIndex, instrument: true };
}

export function setPageAreaVisibility(visible) {
  return { type: types.SET_PAGE_AREA_VISIBILITY, visible };
}

export function setUserTypedLocation(payload) {
  return dispatch => {
    // Update this window's state before telling the profile service.
    dispatch({ type: types.SET_USER_TYPED_LOCATION, payload, instrument: false });

    ipcRenderer.send('profile-command', profileCommands.setUserTypedLocation(payload.text));
  };
}

export function bookmark(url, title) {
  return dispatch => {
    // Update this window's state before telling the profile service.
    dispatch({ type: types.SET_BOOKMARK_STATE, url, isBookmarked: true, title });

    ipcRenderer.send('profile-command', profileCommands.bookmark(url));
  };
}

export function unbookmark(url) {
  return dispatch => {
    // Update this window's state before telling the profile service.
    dispatch({ type: types.SET_BOOKMARK_STATE, url, isBookmarked: false });

    ipcRenderer.send('profile-command', profileCommands.unbookmark(url));
  };
}

export function navigatePageTo(pageIndex, location) {
  return { type: types.NAVIGATE_PAGE_TO, pageIndex, location };
}

export function navigatePageBack(pageIndex) {
  return { type: types.NAVIGATE_PAGE_BACK, pageIndex };
}

export function navigatePageForward(pageIndex) {
  return { type: types.NAVIGATE_PAGE_FORWARD, pageIndex };
}

export function navigatePageRefresh(pageIndex) {
  return { type: types.NAVIGATE_PAGE_REFRESH, pageIndex };
}
