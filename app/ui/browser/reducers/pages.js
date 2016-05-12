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
import { Pages, Page } from '../model';
import { isUUID } from '../browser-util';
import { getPageIndexById, getPageIndexBySessionId } from '../selectors';

/**
 * Fairly sure we should hard code this
 */
const HOME_PAGE = 'tofino://mozilla';

const initialState = new Pages({
  pages: Immutable.List.of(),
  currentPageIndex: -1,
});

export default function basic(state = initialState, action) {
  switch (action.type) {
    case types.CREATE_TAB:
    case types.IPC_COMMAND_CREATE_TAB:
      return createTab(state, action.location, action.id, action.options);

    case types.DID_START_SESSION:
      return setPageDetails(state, action.pageId,
                            { sessionId: action.sessionId, ancestorId: action.ancestorId });

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

    case types.SET_PAGE_DETAILS:
      return setPageDetails(state, action.pageId, action.payload);

    case types.SET_CURRENT_TAB:
      return setCurrentTab(state, action.pageId);

    case types.SET_CURRENT_TAB_PREVIOUS:
      return setCurrentTabPrevious(state);

    case types.SET_CURRENT_TAB_NEXT:
      return setCurrentTabNext(state);

    default:
      return state;
  }
}

export function getPages(state) {
  return state.browserWindow.pages;
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

function createTab(state, location = HOME_PAGE, id = undefined, { selected = true }) {
  return state.withMutations(mut => {
    const page = new Page({ id, location });
    mut.update('pages', pages => pages.push(page));
    if (selected) {
      mut.set('currentPageIndex', state.pages.size);
    }
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

  // We never allow closing the last tab.  If the user tries to close the last tab, the action
  // creator dispatches an action to replace the last tab rather than close the last tab.
  const pageCount = state.pages.size;
  assert(pageCount > 1, 'Cannot close last tab.');

  const ancestorId = state.pages.get(pageIndex).ancestorId;
  let ancestorIndex = -1;
  if (ancestorId && ancestorId >= 0) {
    ancestorIndex = getPageIndexBySessionId(state, ancestorId);
  }

  return state.withMutations(mut => {
    mut.update('pages', pages => pages.delete(pageIndex));

    const current = state.currentPageIndex;

    // If we're currently looking at the closed tab and it has an ancestor that is still open,
    // focus the ancestor.
    if (current === pageIndex && ancestorIndex > -1) {
      if (current > ancestorIndex) {
        mut.set('currentPageIndex', ancestorIndex);
      } else {
        mut.set('currentPageIndex', ancestorIndex - 1);
      }
      return;
    }

    // If tab closed comes before our current tab, or if this is the right-most
    // tab and it's selected, decrement the current page index.
    if (current > pageIndex || (current === pageIndex && pageIndex === (pageCount - 1))) {
      mut.set('currentPageIndex', current - 1);
      return;
    }
  });
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

function setCurrentTab(state, pageId) {
  assert(isUUID(pageId), 'SET_CURRENT_TAB requires a page id.');
  const pageIndex = getPageIndexById(state, pageId);
  assert(pageIndex >= 0, `Page ${pageId} not found in current state`);
  return state.set('currentPageIndex', pageIndex);
}

function setCurrentTabPrevious(state) {
  // Immutable handles looping for us via negative indexes.
  const pageToSelect = state.pages.get(state.currentPageIndex - 1);
  if (!pageToSelect) {
    return state;
  }
  return setCurrentTab(state, pageToSelect.id);
}

function setCurrentTabNext(state) {
  const pageCount = state.pages.size;
  const newIndex = state.currentPageIndex + 1;

  // Handling looping when going out of bounds rightward.
  const pageToSelect = state.pages.get(newIndex === pageCount ? 0 : newIndex);
  if (!pageToSelect) {
    return state;
  }
  return setCurrentTab(state, pageToSelect.id);
}
