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

import Immutable from 'immutable';

import UIState from '../model/ui';
import * as ActionTypes from '../constants/action-types';
import * as EffectTypes from '../constants/effect-types';

export default function(state = new UIState(), action) {
  switch (action.type) {
    case ActionTypes.SET_STATUS_TEXT:
      return setStatusText(state, action.statusText);

    case ActionTypes.SET_PAGE_SEARCH_VISIBILITY:
      return setPageSearchVisibility(state, action.visibility);

    case ActionTypes.SET_OVERVIEW_VISIBILITY:
      return setOverviewVisibility(state, action.visibility);

    case ActionTypes.CREATE_PAGE:
    case ActionTypes.SET_SELECTED_PAGE:
      state = setPageSearchVisibility(state, false);
      state = setOverviewVisibility(state, false);
      return state;

    case ActionTypes.SET_LOCATION_AUTOCOMPLETIONS:
      return setLocationAutocompletions(state, action.autocompletions);

    case EffectTypes.NAVIGATE_PAGE_TO:
    case EffectTypes.NAVIGATE_PAGE_BACK:
    case EffectTypes.NAVIGATE_PAGE_FORWARD:
    case EffectTypes.NAVIGATE_PAGE_REFRESH:
      return setLocationAutocompletions(state, []);

    default:
      return state;
  }
}

function setStatusText(state, statusText) {
  return state.set('statusText', statusText);
}

function setPageSearchVisibility(state, visibility) {
  return state.set('pageSearchVisible', visibility);
}

function setOverviewVisibility(state, visibility) {
  return state.set('overviewVisible', visibility);
}

function setLocationAutocompletions(state, autocompletions) {
  return state.set('locationAutocompletions', Immutable.List(autocompletions));
}
