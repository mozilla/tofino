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

import * as types from '../constants/action-types';
import { State, VisitedPage, StarredItem } from '../model';

const initialState = new State({
  visitedPages: Immutable.List(),
});

export default function(state = initialState, action) {
  switch (action.type) {
    case types.SHOW_HISTORY:
      return showHistory(state, action.visitedPages);

    case types.SHOW_STARS:
      return showStars(state, action.starredItems);

    default:
      return state;
  }
}

function showHistory(state, visitedPages) {
  const records = visitedPages.map(p => new VisitedPage({ uri: p.url, ...p }));
  return state.setIn(['uiState', 'visitedPages'], Immutable.List.of(...records));
}

function showStars(state, starredItems) {
  const records = starredItems.map(p => new StarredItem({ location: p.url, ...p }));
  return state.setIn(['uiState', 'starredItems'], Immutable.List.of(...records));
}
