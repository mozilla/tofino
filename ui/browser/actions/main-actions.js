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

import * as types from '../constants/action-types';

export function createTab(location) {
  return { type: types.CREATE_TAB, location };
}

export function duplicateTab(pageIndex) {
  return { type: types.DUPLICATE_TAB, pageIndex };
}
export function attachTab(page) {
  return { type: types.ATTACH_TAB, page };
}

export function closeTab(pageIndex) {
  return { type: types.CLOSE_TAB, pageIndex };
}

export function setLocation(userTyped) {
  return { type: types.SET_LOCATION, userTyped };
}

export function setPageDetails(pageIndex, details) {
  return { type: types.SET_PAGE_DETAILS, pageIndex, details };
}

export function setCurrentTab(pageIndex) {
  return { type: types.SET_CURRENT_TAB, pageIndex };
}

export function setPageOrder(pageOrder) {
  return { type: types.SET_PAGE_ORDER, pageOrder };
}
