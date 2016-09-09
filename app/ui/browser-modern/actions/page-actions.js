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
  return {
    type: ActionTypes.SET_SELECTED_PAGE_INDEX,
    pageIndex,
  };
}

export function setSelectedPagePrevious() {
  return {
    type: ActionTypes.SET_SELECTED_PAGE_PREVIOUS,
  };
}

export function setSelectedPageNext() {
  return {
    type: ActionTypes.SET_SELECTED_PAGE_NEXT,
  };
}

export function resetPageData(pageId) {
  return {
    type: ActionTypes.RESET_PAGE_DATA,
    pageId,
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
