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

// Pages maps and lists getters.

export function getUnorderedPages(state) {
  return state.pages.map;
}

export function getPageIdsInCreationOrder(state) {
  return state.pages.ids;
}

export function getPageIdsInDisplayOrder(state) {
  return state.pages.displayOrder;
}

export function getPageCount(state) {
  return getPageIdsInDisplayOrder(state).size;
}

// You might just want to use `getPageIdsInDisplayOrder` instead, unless you need
// access to the entire page models themselves (not just a handful of props).
export function getPages(state) {
  return getPageIdsInDisplayOrder(state).map(id => getPageById(state, id));
}

// Specific page getters.

export function getPageById(state, id) {
  return getUnorderedPages(state).get(id);
}

export function getPageByIndex(state, index) {
  return getPageById(state, getPageIdByIndex(index));
}

export function hasPageWithId(state, id) {
  return getUnorderedPages(state).has(id);
}

export function hasPageAtIndex(state, index) {
  return getPageIdsInDisplayOrder(state).has(index);
}

export function getPageIndexById(state, id) {
  return getPageIdsInDisplayOrder(state).indexOf(id);
}

export function getPageIdByIndex(state, index) {
  return getPageIdsInDisplayOrder(state).get(index);
}

// Selected page getters.

export function getSelectedPageId(state) {
  return state.pages.selectedId;
}

export function getSelectedPageIndex(state) {
  return getPageIndexById(state, getSelectedPageId(state));
}

export function getSelectedPage(state) {
  return getPageById(state, getSelectedPageId(state));
}

// Pinned page getters.

export function getLastPinnedPageIndex(state) {
  return getPageIdsInDisplayOrder(state).findLastIndex(id => getPagePinned(state, id));
}

// Page meta/state/ui getters.

export function getPageMeta(state, id) {
  return getPageById(state, id).meta;
}

export function getPageState(state, id) {
  return getPageById(state, id).state;
}

export function getPageUIState(state, id) {
  return getPageById(state, id).uiState;
}

// Page internal state getters.

export function getPageNavigationType(state, id) {
  return getPageState(state, id).navigationType;
}

export function getPageHistoryIndex(state, id) {
  return getPageById(state, id).historyIndex;
}

// Page internal UI state getters

export function getPageSearchVisible(state, id) {
  return getPageUIState(state, id).searchVisible;
}

export function getPageZoomLevel(state, id) {
  return getPageUIState(state, id).zoomLevel;
}

export function getPagePinned(state, id) {
  return getPageUIState(state, id).pinned;
}

// Page misc.

export function getPageCanGoBack(state, id) {
  const { historyIndex } = getPageById(state, id);
  return historyIndex > 0;
}

export function getPageCanGoForward(state, id) {
  const { history, historyIndex } = getPageById(state, id);
  return historyIndex < history.size - 1;
}

export function getPageCanRefresh() {
  // Nothing prevents a page from being able to refresh yet.
  return true;
}
