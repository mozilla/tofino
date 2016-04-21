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
import { attachUnique } from '../browser-util';

/**
 * Fairly sure we should hard code this
 */
const HOME_PAGE = 'https://www.mozilla.org/';

const initialState = new State({
  pages: Immutable.List.of(new Page({ location: HOME_PAGE })),
  currentPageIndex: 0,
  pageAreaVisible: false,
});

export default function basic(state = initialState, action) {
  switch (action.type) {
    case types.CREATE_TAB:
      return createTab(state, action.location);

    case types.DUPLICATE_TAB:
      return duplicateTab(state, action.pageIndex);

    case types.ATTACH_TAB:
      return attachTab(state, action.page);

    case types.CLOSE_TAB:
      return closeTab(state, action.pageIndex);

    case types.NAVIGATE_PAGE_BACK:
      return navigatePageBack(state, action.pageIndex);

    case types.NAVIGATE_PAGE_FORWARD:
      return navigatePageForward(state, action.pageIndex);

    case types.NAVIGATE_PAGE_REFRESH:
      return navigatePageRefresh(state, action.pageIndex);

    case types.NAVIGATE_PAGE_TO:
      return navigatePageTo(state, action.pageIndex, action.location);

    case types.SET_PAGE_DETAILS:
      return setPageDetails(state, action);

    case types.SET_CURRENT_TAB:
      return setCurrentTab(state, action.pageIndex);

    case types.SET_PAGE_ORDER:
      return setPageOrder(state, action.pageIndex, action.updatedIndex);

    case types.SET_PAGE_AREA_VISIBILITY:
      return setPageAreaVisibility(state, action.visible);

    case types.SET_USER_TYPED_LOCATION:
      return setUserTypedLocation(state, action);

    case types.SET_BOOKMARK_STATE:
      return setBookmarkState(state, action.url, action.isBookmarked);

    case profileDiffTypes.BOOKMARKS: {
      return setBookmarks(state, Immutable.Set(action.payload));
    }

    case profileDiffTypes.COMPLETIONS: {
      return state.setIn(['profile', 'completions'], Immutable.Map(action.payload));
    }

    default:
      return state;
  }
}

function createTab(state, location = HOME_PAGE) {
  return state.withMutations(mut => {
    const page = new Page({ location });
    mut.update('pages', pages => pages.push(page));
    mut.set('currentPageIndex', state.pages.size);
    mut.set('pageAreaVisible', true);
  });
}

function duplicateTab(state, pageIndex) {
  const location = state.pages.get(pageIndex).location;
  return createTab(state, location);
}

function attachTab(state, page) {
  return state.withMutations(mut => {
    const newPage = new Page(page);
    mut.set('pages', Immutable.List.of(newPage));
    mut.set('currentPageIndex', 0);
  });
}

function closeTab(state, pageIndex) {
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

function navigatePageBack(state, pageIndex) {
  assert(typeof pageIndex === 'number', '`pageIndex` must be a number.');

  if (pageIndex === -1) {
    pageIndex = state.currentPageIndex;
  }

  assert(state.pages.get(pageIndex).canGoBack, 'Page cannot go back.');

  return state.updateIn(['pages', pageIndex, 'commands'], commands => commands.push(attachUnique({
    command: 'back',
  })));
}

function navigatePageForward(state, pageIndex) {
  assert(typeof pageIndex === 'number', '`pageIndex` must be a number.');

  if (pageIndex === -1) {
    pageIndex = state.currentPageIndex;
  }

  assert(state.pages.get(pageIndex).canGoForward, 'Page cannot go forward.');

  return state.updateIn(['pages', pageIndex, 'commands'], commands => commands.push(attachUnique({
    command: 'forward',
  })));
}

function navigatePageRefresh(state, pageIndex) {
  assert(typeof pageIndex === 'number', '`pageIndex` must be a number.');

  if (pageIndex === -1) {
    pageIndex = state.currentPageIndex;
  }

  assert(state.pages.get(pageIndex).canRefresh, 'Page cannot refresh.');

  return state.updateIn(['pages', pageIndex, 'commands'], commands => commands.push(attachUnique({
    command: 'refresh',
  })));
}

function navigatePageTo(state, pageIndex, location) {
  assert(typeof pageIndex === 'number', '`pageIndex` must be a number.');
  assert(typeof location === 'string', '`location` must be a string.');

  if (pageIndex === -1) {
    pageIndex = state.currentPageIndex;
  }

  return state.updateIn(['pages', pageIndex, 'commands'], commands => commands.push(attachUnique({
    location,
    command: 'navigate-to',
  })));
}

function setPageDetails(state, { payload }) {
  let pageIndex = payload.pageIndex;

  assert(typeof pageIndex === 'number', '`pageIndex` must be a number.');

  if (pageIndex === -1) {
    pageIndex = state.currentPageIndex;
  }

  return state.withMutations(mut => {
    for (const [key, value] of Object.entries(payload)) {
      if (key === 'pageIndex') {
        continue;
      }
      assert(key !== 'userTyped', '`userTyped` must be set in setUserTypedLocation.');
      mut.setIn(['pages', pageIndex, key], value);
    }
  });
}

function setUserTypedLocation(state, { payload: { pageIndex, text } }) {
  assert(typeof pageIndex === 'number', '`pageIndex` must be a number.');

  if (pageIndex === -1) {
    pageIndex = state.currentPageIndex;
  }

  return state.setIn(['pages', pageIndex, 'userTyped'], text);
}

function setCurrentTab(state, pageIndex) {
  return state.set('currentPageIndex', pageIndex);
}

function setPageOrder(state, pageIndex, updatedIndex) {
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
