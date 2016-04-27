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

import assert from 'assert';
import * as types from '../constants/action-types';
import * as profileCommands from '../../../shared/profile-commands';
import { ipcRenderer } from '../../../shared/electron';
import { getWebViewById, fixURL, getPageIndexById, isUUID } from '../browser-util';

/**
 * Takes a function and action name. Calls the function/action-creator in
 * a try block to stop progression of an action creator upon error,
 * as well as rethrow the error with the related action type.
 *
 * @param {Function} fn
 * @param {String} action
 * @return {Function}
 */
function tagErrors(fn, action) {
  return function(...args) {
    try {
      fn(...args);
    } catch (e) {
      e.message = `${action}: ${e.message}`;
      throw e;
    }
  };
}

export function createTab(location) {
  return { type: types.CREATE_TAB, location, instrument: true };
}

export function duplicateTab(pageId) {
  return { type: types.DUPLICATE_TAB, pageId, instrument: true };
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

// @TODO Linting https://github.com/eslint/eslint/issues/3587
export function navigatePageTo(pageId, location, doc=document) { // eslint-disable-line
  return tagErrors((dispatch, getState) => {
    assert(typeof location === 'string', '`location` must be a string.');
    assert(isUUID(pageId), `Invalid page id: ${pageId}`);
    assert(getPageIndexById(getState(), pageId) >= 0,
      `Page ${pageId} not found in current state.`);

    dispatch({ type: types.NAVIGATE_PAGE_TO, pageId, location });
    getWebViewById(doc, pageId).setAttribute('src', fixURL(location));
  }, types.NAVIGATE_PAGE_TO);
}

// @TODO Linting https://github.com/eslint/eslint/issues/3587
export function navigatePageBack(pageId, doc=document) { // eslint-disable-line
  return tagErrors((dispatch, getState) => {
    assert(isUUID(pageId), `Invalid page id: ${pageId}`);
    const pageIndex = getPageIndexById(getState(), pageId);
    assert(pageIndex >= 0, `Page ${pageId} not found in current state.`);
    assert(getState().browserWindow.pages.get(pageIndex).canGoBack, 'Page cannot go back.');

    dispatch({ type: types.NAVIGATE_PAGE_BACK, pageId });
    getWebViewById(doc, pageId).goBack();
  }, types.NAVIGATE_PAGE_BACK);
}

// @TODO Linting https://github.com/eslint/eslint/issues/3587
export function navigatePageForward(pageId, doc=document) { // eslint-disable-line
  return tagErrors((dispatch, getState) => {
    assert(isUUID(pageId), `Invalid page id: ${pageId}`);
    const pageIndex = getPageIndexById(getState(), pageId);
    assert(pageIndex >= 0, `Page ${pageId} not found in current state.`);
    assert(getState().browserWindow.pages.get(pageIndex).canGoForward, 'Page cannot go forward.');

    dispatch({ type: types.NAVIGATE_PAGE_FORWARD, pageId });
    getWebViewById(doc, pageId).goForward();
  }, types.NAVIGATE_PAGE_FORWARD);
}

// @TODO Linting https://github.com/eslint/eslint/issues/3587
export function navigatePageRefresh(pageId, doc=document) { // eslint-disable-line
  return tagErrors((dispatch, getState) => {
    assert(isUUID(pageId), `Invalid page id: ${pageId}`);
    const pageIndex = getPageIndexById(getState(), pageId);
    assert(pageIndex >= 0, `Page ${pageId} not found in current state.`);
    assert(getState().browserWindow.pages.get(pageIndex).canRefresh, 'Page cannot refresh.');

    dispatch({ type: types.NAVIGATE_PAGE_REFRESH, pageId });
    getWebViewById(doc, pageId).reload();
  }, types.NAVIGATE_PAGE_REFRESH);
}
