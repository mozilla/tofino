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
import LocationAutocompletion from '../model/location-autocompletion';
import * as ActionTypes from '../constants/action-types';
import * as EffectTypes from '../constants/effect-types';

export default function(state = new UIState(), action) {
  switch (action.type) {
    case ActionTypes.SET_STATUS_TEXT:
      return setStatusText(state, action.statusText);

    case ActionTypes.SET_OVERVIEW_VISIBILITY:
      return setOverviewVisibility(state, action.visibility);

    case ActionTypes.CREATE_PAGE:
    case ActionTypes.SET_SELECTED_PAGE:
      return setOverviewVisibility(state, false);

    case ActionTypes.SET_LOCATION_AUTOCOMPLETIONS:
      return setLocationAutocompletions(state, action.pageId, action.autocompletions);

    case ActionTypes.REMOVE_PAGE:
    case EffectTypes.NAVIGATE_PAGE_TO:
    case EffectTypes.NAVIGATE_PAGE_BACK:
    case EffectTypes.NAVIGATE_PAGE_FORWARD:
    case EffectTypes.NAVIGATE_PAGE_REFRESH:
      return setLocationAutocompletions(state, action.pageId, null);

    default:
      return state;
  }
}

function setStatusText(state, statusText) {
  return state.set('statusText', statusText);
}

function setOverviewVisibility(state, visibility) {
  return state.set('overviewVisible', visibility);
}

function setLocationAutocompletions(state, pageId, autocompletions) {
  if (!autocompletions || !autocompletions.length) {
    return state.deleteIn(['locationAutocompletions', pageId]);
  }
  const records = autocompletions.map(e => new LocationAutocompletion(e));
  return state.setIn(['locationAutocompletions', pageId], Immutable.List(records));
}
