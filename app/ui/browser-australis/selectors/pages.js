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
  return state.pages.list;
}

export function getSelectedPage(state) {
  return getPageById(state, getSelectedPageId(state));
}

export function getSelectedPageId(state) {
  return state.pages.selectedId;
}

export function getSelectedPageIndex(state) {
  return state.pages.list.findIndex(page => page.id === state.pages.selectedId);
}

export function getPageById(state, id) {
  return state.pages.list.find(page => page.id === id);
}
