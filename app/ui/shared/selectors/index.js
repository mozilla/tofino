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

export function getPages(state) {
  return state.pages.pages;
}

export function getCurrentPage(state) {
  const index = getCurrentPageIndex(state);
  return getPageByIndex(state, index);
}

export function getCurrentPageIndex(state) {
  return state.pages.currentPageIndex;
}

export function getProfile(state) {
  return state.profile;
}

export function getStatusText(state) {
  return state.uiState.statusText;
}

export function getUserTypedLocation(state, pageId) {
  return state.uiState.userTypedLocation.has(pageId) ?
          state.uiState.userTypedLocation.get(pageId) : null;
}

export function showCompletions(state) {
  return state.uiState.showCompletions;
}

export function focusedURLBar(state, pageId) {
  return !!state.uiState.focusedURLBar.get(pageId);
}

export function showURLBar(state, pageId) {
  return !!state.uiState.showURLBar.get(pageId);
}

export function focusedResultIndex(state) {
  return state.uiState.focusedResultIndex;
}

export function getPageById(state, id) {
  return state.pages.pages.find(page => page.id === id);
}

export function getPageByIndex(state, index) {
  return state.pages.pages.get(index);
}

export function getPageIndexById(state, id) {
  return state.pages.findIndex(page => page.id === id);
}

export function getPageIndexBySessionId(state, sessionId) {
  return state.pages.findIndex(page => page.sessionId === sessionId);
}
