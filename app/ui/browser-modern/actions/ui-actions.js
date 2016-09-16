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

export function setStatusText(statusText) {
  return {
    type: ActionTypes.SET_STATUS_TEXT,
    statusText,
  };
}

export function showOverview() {
  return {
    type: ActionTypes.SET_OVERVIEW_VISIBILITY,
    visibility: true,
  };
}

export function hideOverview() {
  return {
    type: ActionTypes.SET_OVERVIEW_VISIBILITY,
    visibility: false,
  };
}

export function setLocationAutocompletions(pageId, autocompletions) {
  return {
    type: ActionTypes.SET_LOCATION_AUTOCOMPLETIONS,
    pageId,
    autocompletions,
  };
}
