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
import * as types from '../constants/action-types';
import { State, Page } from '../model';

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

    case types.SET_LOCATION:
      return setLocation(state, action.userTyped);

    case types.SET_PAGE_DETAILS:
      return setPageDetails(state, action.pageIndex, action.details);

    case types.SET_CURRENT_TAB:
      return setCurrentTab(state, action.pageIndex);

    case types.SET_PAGE_ORDER:
      return setPageOrder(state, action.pageIndex, action.updatedIndex);

    case types.SET_PAGE_AREA_VISIBILITY:
      return setPageAreaVisibility(state, action.visible);

    default:
      return state;
  }
}

function createTab(state, location = HOME_PAGE) {
  const page = new Page({ location });
  return state.update('pages', pages => pages.push(page))
              .set('currentPageIndex', state.pages.size)
              .set('pageAreaVisible', true);
}

function duplicateTab(state, pageIndex) {
  const location = state.pages.get(pageIndex).location;
  const page = new Page({ location });
  return state.update('pages', pages => pages.push(page))
              .set('currentPageIndex', state.pages.size);
}

function attachTab(state, page) {
  const newPage = new Page(page);
  return new State({
    pages: Immutable.List.of(newPage),
    currentPageIndex: 0,
  });
}

function closeTab(state, pageIndex) {
  // last tab, full reset
  if (state.pages.size === 1) {
    return initialState;
  }

  // Remove from the pages set
  let currentPageIndex = state.currentPageIndex;

  const pages = state.pages.delete(pageIndex);

  if (currentPageIndex === pageIndex) {
    // If this was the selected page then select the one earlier in page order
    currentPageIndex = pageIndex > 0 ? pageIndex - 1 : pageIndex;
  } else {
    // Otherwise update to the new index
    if (currentPageIndex > pageIndex) {
      currentPageIndex--;
    }
  }

  return state.set('pages', pages)
              .set('currentPageIndex', currentPageIndex);
}

function setLocation(state, userTyped) {
  return state.setIn(['pages', state.currentPageIndex, 'userTyped'], userTyped);
}

function setPageDetails(state, pageIndex, details) {
  if (pageIndex === -1) {
    pageIndex = state.currentPageIndex;
  }
  let newState = state;
  for (const [key, value] of Object.entries(details)) {
    newState = newState.setIn(['pages', pageIndex, key], value);
  }
  return newState;
}

function setCurrentTab(state, pageIndex) {
  return state.set('currentPageIndex', pageIndex);
}

function setPageOrder(state, pageIndex, updatedIndex) {
  const page = state.pages[pageIndex];
  let pages = state.pages.delete(pageIndex);
  pages = pages.splice(updatedIndex, 0, page);
  return state.set('pages', pages);
}

function setPageAreaVisibility(state, visible) {
  return state.set('pageAreaVisible', visible);
}
