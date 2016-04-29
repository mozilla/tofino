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
import 'babel-polyfill';

import Immutable from 'immutable';
import * as types from '../constants/action-types';
import { State, Page } from '../model';
import * as profileDiffTypes from '../../../shared/constants/profile-diff-types';
import { isUUID } from '../browser-util';

/**
 * Fairly sure we should hard code this
 */
const HOME_PAGE = 'tofino://mozilla';

const initialState = new State({
  pages: Immutable.List.of(new Page({ location: HOME_PAGE })),
  currentPageIndex: 0,
  pageAreaVisible: false,
});

function getPageIndexById(state, id) {
  return state.pages.findIndex(page => page.id === id);
}

export default function basic(state = initialState, action) {
  switch (action.type) {
    case types.CREATE_TAB:
    case types.IPC_COMMAND_CREATE_TAB:
      return createTab(state, action.location);

    case types.IPC_COMMAND_OPEN_BOOKMARK:
      return createTab(state, action.bookmark.location);

    case types.IPC_COMMAND_SHOW_BOOKMARKS:
      return createTab(state, 'atom://bookmarks');

    case types.IPC_COMMAND_FOCUS_URL_BAR:
      return state;

    case types.ATTACH_TAB:
      return attachTab(state, action.page);

    case types.CLOSE_TAB:
    case types.IPC_COMMAND_CLOSE_TAB:
      return closeTab(state, action.pageId);

    case types.NAVIGATE_PAGE_BACK:
      return navigatePageBack(state, action.pageId);

    case types.NAVIGATE_PAGE_FORWARD:
      return navigatePageForward(state, action.pageId);

    case types.NAVIGATE_PAGE_REFRESH:
    case types.IPC_COMMAND_PAGE_REFRESH:
      return navigatePageRefresh(state, action.pageId);

    case types.NAVIGATE_PAGE_TO:
      return navigatePageTo(state, action.pageId, action.location);

    case types.SET_PAGE_DETAILS:
      return setPageDetails(state, action.pageId, action.payload);

    case types.SET_CURRENT_TAB:
      return setCurrentTab(state, action.pageId);

    case types.SET_PAGE_ORDER:
      return setPageOrder(state, action.pageId, action.updatedIndex);

    case types.SET_PAGE_AREA_VISIBILITY:
      return setPageAreaVisibility(state, action.visible);

    case types.SET_USER_TYPED_LOCATION:
      return setUserTypedLocation(state, action.pageId, action.payload);

    case types.SET_BOOKMARK_STATE:
      return setBookmarkState(state, action.url, action.isBookmarked);

    case profileDiffTypes.BOOKMARKS:
      return setBookmarks(state, Immutable.Set(action.payload));

    case profileDiffTypes.COMPLETIONS:
      return state.setIn(['profile', 'completions'], Immutable.Map(action.payload));

    default:
      return state;
  }
}

export function getPages(state) {
  return state.browserWindow.pages;
}

export function getProfile(state) {
  return state.browserWindow.profile;
}

export function getCurrentPage(state) {
  const index = getCurrentPageIndex(state);
  return state.browserWindow.pages.get(index);
}

export function getCurrentPageIndex(state) {
  return state.browserWindow.currentPageIndex;
}

export function getPageAreaVisible(state) {
  return state.browserWindow.pageAreaVisible;
}

function createTab(state, location = HOME_PAGE) {
  return state.withMutations(mut => {
    const page = new Page({ location });
    mut.update('pages', pages => pages.push(page));
    mut.set('currentPageIndex', state.pages.size);
    mut.set('pageAreaVisible', true);
  });
}

function attachTab(state, page) {
  assert(isUUID(page.id), 'ATTACH_TAB requires a page with valid id.');

  return state.withMutations(mut => {
    const newPage = new Page(page);
    mut.set('pages', Immutable.List.of(newPage));
    mut.set('currentPageIndex', 0);
  });
}

function closeTab(state, pageId) {
  assert(isUUID(pageId), 'CLOSE_TAB requires a page id.');
  const pageIndex = getPageIndexById(state, pageId);
  assert(pageIndex >= 0, `Page ${pageId} not found in current state`);

  const pageCount = state.pages.size;

  // If this is the last tab, do a full reset.
  // FIXME: Do we really want to do this? It will also reset the profile
  // and everything else. It seems more likely to me that we just want to do
  // something like creating a new default page, similar to `attachTab`.
  if (pageCount === 1) {
    return initialState;
  }

  return state.withMutations(mut => {
    mut.update('pages', pages => pages.delete(pageIndex));

    // If tab closed comes before our current tab, or if this is the right-most
    // tab and it's selected, decrement the current page index.
    const current = state.currentPageIndex;
    if (current > pageIndex || (current === pageIndex && pageIndex === (pageCount - 1))) {
      mut.set('currentPageIndex', current - 1);
    }
  });
}

function navigatePageBack(state, pageId) {
  assert(isUUID(pageId), 'NAVIGATE_PAGE_BACK requires a page id.');
  const pageIndex = getPageIndexById(state, pageId);
  assert(pageIndex >= 0, `Page ${pageId} not found in current state`);

  assert(state.pages.get(pageIndex).canGoBack, 'Page cannot go back.');

  return state.updateIn(['pages', pageIndex, 'commands'], commands => commands.push({
    command: 'back',
  }));
}

function navigatePageForward(state, pageId) {
  assert(isUUID(pageId), 'NAVIGATE_PAGE_FORWARD requires a page id.');
  const pageIndex = getPageIndexById(state, pageId);
  assert(pageIndex >= 0, `Page ${pageId} not found in current state`);

  assert(state.pages.get(pageIndex).canGoForward, 'Page cannot go forward.');

  return state.updateIn(['pages', pageIndex, 'commands'], commands => commands.push({
    command: 'forward',
  }));
}

function navigatePageRefresh(state, pageId) {
  assert(isUUID(pageId), 'NAVIGATE_PAGE_REFRESH requires a page id.');
  const pageIndex = getPageIndexById(state, pageId);
  assert(pageIndex >= 0, `Page ${pageId} not found in current state`);

  assert(state.pages.get(pageIndex).canRefresh, 'Page cannot refresh.');

  return state.updateIn(['pages', pageIndex, 'commands'], commands => commands.push({
    command: 'refresh',
  }));
}

function navigatePageTo(state, pageId, location) {
  assert(typeof location === 'string', '`location` must be a string.');
  assert(isUUID(pageId), 'NAVIGATE_PAGE_TO requires a page id.');
  const pageIndex = getPageIndexById(state, pageId);
  assert(pageIndex >= 0, `Page ${pageId} not found in current state`);

  return state.updateIn(['pages', pageIndex, 'commands'], commands => commands.push({
    location,
    command: 'navigate-to',
  }));
}

function setPageDetails(state, pageId, payload) {
  assert(isUUID(pageId), 'SET_PAGE_DETAILS requires a page id.');
  const pageIndex = getPageIndexById(state, pageId);
  assert(pageIndex >= 0, `Page ${pageId} not found in current state`);

  return state.withMutations(mut => {
    for (const [key, value] of Object.entries(payload)) {
      if (key === 'id') {
        console.warn('Skipping setting of `id` on page.');
        continue;
      }
      assert(key !== 'userTyped', '`userTyped` must be set in setUserTypedLocation.');
      mut.setIn(['pages', pageIndex, key], value);
    }
  });
}

function setUserTypedLocation(state, pageId, { text }) {
  assert(isUUID(pageId), 'SET_USER_TYPED_LOCATION requires a page id.');
  const pageIndex = getPageIndexById(state, pageId);
  assert(pageIndex >= 0, `Page ${pageId} not found in current state`);

  return state.setIn(['pages', pageIndex, 'userTyped'], text);
}

function setCurrentTab(state, pageId) {
  assert(isUUID(pageId), 'SET_CURRENT_TAB requires a page id.');
  const pageIndex = getPageIndexById(state, pageId);
  assert(pageIndex >= 0, `Page ${pageId} not found in current state`);
  return state.set('currentPageIndex', pageIndex);
}

function setPageOrder(state, pageId, updatedIndex) {
  assert(isUUID(pageId), 'SET_PAGE_ORDER requires a page id.');
  const pageIndex = getPageIndexById(state, pageId);
  assert(pageIndex >= 0, `Page ${pageId} not found in current state`);
  let currentPageIndex = state.currentPageIndex;

  // If we're moving our current page, or moving a page 'over'
  // our selected tab, ensure the index is still referencing the same page
  if (currentPageIndex === pageIndex) {
    currentPageIndex = updatedIndex;
  } else {
    if (pageIndex < currentPageIndex) {
      currentPageIndex--;
    }
    if (updatedIndex <= currentPageIndex) {
      currentPageIndex++;
    }
  }

  return state.withMutations(mut => {
    const page = state.pages.get(pageIndex);

    // Can't use `withMutations` on these `pages` operations because only `set`,
    // `push`, `pop`, `shift`, `unshift` and `merge` may be used mutatively.
    let pages = state.pages;
    pages = pages.delete(pageIndex);
    pages = pages.insert(updatedIndex, page);

    mut.set('pages', pages);
    mut.set('currentPageIndex', currentPageIndex);
  });
}

function setPageAreaVisibility(state, visible) {
  return state.set('pageAreaVisible', visible);
}

function setBookmarkState(state, url, isBookmarked) {
  return state.setIn(['profile', 'bookmarks'], isBookmarked
    ? state.profile.bookmarks.add(url)
    : state.profile.bookmarks.delete(url));
}

function setBookmarks(state, bookmarks) {
  return state.setIn(['profile', 'bookmarks'], bookmarks);
}
