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
import { logger } from '../../../shared/logging';
import * as types from '../constants/action-types';
import { HOME_PAGE } from '../constants/ui';
import { Pages, Page } from '../model';
import { getPageIndexById, getPageIndexBySessionId } from '../selectors';

const initialState = new Pages({
  pages: Immutable.List.of(),
  currentPageIndex: -1,
});

export default function basic(state = initialState, action) {
  switch (action.type) {
    case types.CREATE_TAB:
      return createTab(state, action.location, action.id, action.options);

    case types.DID_START_SESSION:
      return setPageDetails(state, action.pageId,
                            { sessionId: action.sessionId, ancestorId: action.ancestorId });

    case types.ATTACH_TAB:
      return attachTab(state, action.page);

    case types.CLOSE_TAB:
      return closeTab(state, action.pageId);

    case types.SET_PAGE_STATE:
      return setPageState(state, action.pageId, action.state);

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

/* eslint-disable */
function createTab(state, location = HOME_PAGE, id = undefined, { selected = true, index = undefined }) {
/* eslint-enable */
  return state.withMutations(mut => {
    const page = new Page({ id, location });
    index = index != null ? index : state.pages.size;

    mut.update('pages', pages => pages.insert(index, page));

    // Update the selected index if this new page is to be selected,
    // or if the current page has a higher index than where we are inserting
    // this page (so to maintain the current page's selection)
    if (selected) {
      mut.set('currentPageIndex', index);
    } else if (mut.get('currentPageIndex') >= index) {
      mut.set('currentPageIndex', index + 1);
    }
  });
}

function attachTab(state, page) {
  return state.withMutations(mut => {
    const newPage = new Page(page);
    mut.set('pages', Immutable.List.of(newPage));
    mut.set('currentPageIndex', 0);
  });
}

function closeTab(state, pageId) {
  const pageIndex = getPageIndexById(state, pageId);

  // We never allow closing the last tab.  If the user tries to close the last tab, the action
  // creator dispatches an action to replace the last tab rather than close the last tab.
  const pageCount = state.pages.size;

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

function setPageState(state, pageId, pageState) {
  const pageIndex = getPageIndexById(state, pageId);

  return state.withMutations(mut => {
    mut.setIn(['pages', pageIndex, 'state'], pageState);
  });
}

function setPageDetails(state, pageId, payload) {
  const pageIndex = getPageIndexById(state, pageId);

  return state.withMutations(mut => {
    for (const [key, value] of Object.entries(payload)) {
      if (key === 'id') {
        logger.warn('Skipping setting of `id` on page.');
        continue;
      }
      mut.setIn(['pages', pageIndex, key], value);
    }
  });
}

function setCurrentTab(state, pageId) {
  const pageIndex = getPageIndexById(state, pageId);
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
