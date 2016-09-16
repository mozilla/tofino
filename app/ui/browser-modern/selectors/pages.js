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

export function getOrderedPageIds(state) {
  return state.pages.orderedIds;
}

export function getPageCount(state) {
  return getOrderedPageIds(state).size;
}

// You might just want to use `getOrderedPageIds` instead, unless you need
// access to the entire page models themselves (not just a handful of props).
export function getPages(state) {
  return getOrderedPageIds(state).map(id => getPageById(state, id));
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
  return getOrderedPageIds(state).has(index);
}

export function getPageIndexById(state, id) {
  return getOrderedPageIds(state).indexOf(id);
}

export function getPageIdByIndex(state, index) {
  return getOrderedPageIds(state).get(index);
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

// Page data getters.

export function getPageMeta(state, id) {
  return getPageById(state, id).meta;
}

export function getPageState(state, id) {
  return getPageById(state, id).state;
}

export function getPageSearchVisible(state, id) {
  return getPageState(state, id).searchVisible;
}

export function getPageZoomLevel(state, id) {
  return getPageState(state, id).zoomLevel;
}
