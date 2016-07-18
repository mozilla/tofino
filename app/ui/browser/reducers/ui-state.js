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

import assert from 'assert';

import * as types from '../constants/action-types';
import { UIState } from '../model';
import { isUUID } from '../browser-util';

const initialState = new UIState();

export default function uiState(state = initialState, action) {
  switch (action.type) {
    // Per-Page state modifications first.  Eventually, we'll separate another reducer here.
    case types.LOCATION_CHANGED:
      assert(isUUID(action.pageId), 'LOCATION_CHANGED requires a page id.');
      return state.setIn(['userTypedLocation', action.pageId], action.payload.text);

    case types.SET_USER_TYPED_LOCATION:
      assert(isUUID(action.pageId), 'SET_USER_TYPED_LOCATION requires a page id.');
      return state.withMutations(mut => {
        mut.setIn(['userTypedLocation', action.pageId], action.payload.text);
        mut.set('showCompletions', true);
      });

    case types.SET_URL_INPUT_VISIBLE:
      assert(isUUID(action.pageId), 'SET_URL_INPUT_VISIBLE requires a page id.');
      return state.setIn(['showURLBar', action.pageId], action.payload.visible);

    case types.SET_URL_INPUT_FOCUSED:
      assert(isUUID(action.pageId), 'SET_URL_INPUT_FOCUSED requires a page id.');
      return state.setIn(['focusedURLBar', action.pageId], action.payload.focused);

    // Global state second.  The reset action might just return the blank `initialState` once we
    // extract the per-Page reducer.  Until that time, we don't want to drop the per-Page details
    // when we reset.
    case types.RESET_UI_STATE:
      return state.set('showCompletions', false);

    case types.SET_STATUS_TEXT:
      return state.set('statusText', action.text);

    case types.CLEAR_COMPLETIONS:
      return state.set('showCompletions', false);

    case types.SET_URL_INPUT_AUTOCOMPLETE_INDEX:
      return state.set('focusedResultIndex', action.payload.index);

    case types.TOGGLE_PAGE_SUMMARIES: {
      const prev = state.showPageSummaries;
      return state.set('showPageSummaries', !prev);
    }

    case types.CREATE_TAB:
    case types.SET_CURRENT_TAB:
    case types.SET_CURRENT_TAB_PREVIOUS:
    case types.SET_CURRENT_TAB_NEXT:
      return state.set('showPageSummaries', false);

    default:
      return state;
  }
}
