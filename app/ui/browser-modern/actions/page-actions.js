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

import * as ActionTypes from '../constants/action-types';
import * as PagesSelectors from '../selectors/pages';

export function createPage(id, location, options) {
  return {
    type: ActionTypes.CREATE_PAGE,
    id,
    location,
    options,
  };
}

export function removePage(pageId) {
  return {
    type: ActionTypes.REMOVE_PAGE,
    pageId,
  };
}

export function setSelectedPage(pageId) {
  return {
    type: ActionTypes.SET_SELECTED_PAGE,
    pageId,
  };
}

export function setSelectedPageIndex(pageIndex) {
  return (dispatch, getState) => {
    dispatch(setSelectedPage(PagesSelectors.getPageIdByIndex(getState(), pageIndex)));
  };
}

export function setSelectedPagePrevious() {
  return (dispatch, getState) => {
    const selectedIndex = PagesSelectors.getSelectedPageIndex(getState());

    // Immutable handles looping for us via negative indexes.
    const prevIndex = selectedIndex - 1;
    dispatch(setSelectedPageIndex(prevIndex));
  };
}

export function setSelectedPageNext() {
  return (dispatch, getState) => {
    const selectedIndex = PagesSelectors.getSelectedPageIndex(getState());
    const pageCount = PagesSelectors.getPageCount(getState());

    // Manually handle looping when going out of bounds rightward.
    const nextIndex = selectedIndex === pageCount - 1 ? 0 : selectedIndex + 1;
    dispatch(setSelectedPageIndex(nextIndex));
  };
}

export function resetPageData(pageId) {
  return {
    type: ActionTypes.RESET_PAGE_DATA,
    pageId,
  };
}

export function setPageIndex(pageId, pageIndex) {
  return {
    type: ActionTypes.SET_PAGE_INDEX,
    pageId,
    pageIndex,
  };
}

export function setPageDetails(pageId, pageDetails) {
  return {
    type: ActionTypes.SET_PAGE_DETAILS,
    pageId,
    pageDetails,
  };
}

export function setPageMeta(pageId, pageMeta) {
  return {
    type: ActionTypes.SET_PAGE_META,
    pageId,
    pageMeta,
  };
}

export function setPageState(pageId, pageState) {
  return {
    type: ActionTypes.SET_PAGE_STATE,
    pageId,
    pageState,
  };
}

export function setPageUIState(pageId, pageUIState) {
  return {
    type: ActionTypes.SET_PAGE_UI_STATE,
    pageId,
    pageUIState,
  };
}

export function preventInteractionForPage(pageId) {
  return setPageUIState(pageId, { preventInteraction: true });
}

export function allowInteractionForPage(pageId) {
  return setPageUIState(pageId, { preventInteraction: false });
}

export function setPagePinned(pageId) {
  return (dispatch, getState) => {
    // When there's no pinned pages, the "last pinned page index" will be -1.
    const lastIndex = PagesSelectors.getLastPinnedPageIndex(getState());
    dispatch(setPageIndex(pageId, lastIndex + 1));
    // Set the `pinned` state *last*, so that the above selector
    // actually does what we want.
    dispatch(setPageUIState(pageId, { pinned: true }));
  };
}

export function setPageUnpinned(pageId) {
  return (dispatch, getState) => {
    // When there's no pinned pages, the "last pinned page index" will be -1.
    const lastIndex = PagesSelectors.getLastPinnedPageIndex(getState());
    dispatch(setPageIndex(pageId, lastIndex));
    // Set the `pinned` state *last*, so that the above selector
    // actually does what we want.
    dispatch(setPageUIState(pageId, { pinned: false }));
  };
}

export function showPageSearch(pageId) {
  return dispatch => {
    dispatch(setPageUIState(pageId, { searchVisible: true }));
    dispatch(setPageUIState(pageId, { searchFocused: true }));
  };
}

export function hidePageSearch(pageId) {
  return dispatch => {
    dispatch(setPageUIState(pageId, { searchVisible: false }));
    dispatch(setPageUIState(pageId, { searchFocused: false }));
  };
}

export function showCurrentPageSearch() {
  return (dispatch, getState) => {
    dispatch(showPageSearch(PagesSelectors.getSelectedPageId(getState())));
  };
}

export function hideCurrentPageSearch() {
  return (dispatch, getState) => {
    dispatch(hidePageSearch(PagesSelectors.getSelectedPageId(getState())));
  };
}

export function setLocalPageHistory(pageId, history, historyIndex) {
  return {
    type: ActionTypes.SET_LOCAL_PAGE_HISTORY,
    pageId,
    history,
    historyIndex,
  };
}

export function popRecentlyClosedPage() {
  return {
    type: ActionTypes.POP_RECENTLY_CLOSED_PAGE,
  };
}
