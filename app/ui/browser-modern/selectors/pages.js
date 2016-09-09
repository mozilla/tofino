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

// You might just want to use `getOrderedPageIds` instead.
export function getPages(state) {
  return getOrderedPageIds(state).map(id => getPageById(state, id));
}

export function getPageById(state, id) {
  return state.pages.map.get(id);
}

export function getOrderedPageIds(state) {
  return state.pages.orderedIds;
}

export function getSelectedPageId(state) {
  return state.pages.selectedId;
}

export function getSelectedPage(state) {
  return getPageById(state, getSelectedPageId(state));
}

export function getSelectedPageIndex(state) {
  return getOrderedPageIds(state).findIndex(id => id === getSelectedPageId(state));
}
