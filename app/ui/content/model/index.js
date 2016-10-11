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

/**
 * The saved data directly related to a "visited page", part of the
 * browser history.
 */
export const VisitedPage = Immutable.Record({
  uri: null,
  title: null,
  snippet: null,
  lastVisited: null,
}, 'VisitedPage');

/**
 * The saved data directly related to a "starred item".
 */
export const StarredItem = Immutable.Record({
  location: null,
  title: null,
}, 'StarredItem');

/**
 * The UI state.
 */
export const UIState = Immutable.Record({
  visitedPages: Immutable.List(),
  starredItems: Immutable.List(),
}, 'UIState');

/**
 * Aggregate state.  Keep this synchronized with ../reducers/index.js!
 */
export const State = Immutable.Record({
  uiState: new UIState(),
}, 'State');
