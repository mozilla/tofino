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

export function showHistory({ UA, query, limit }) {
  return async function(dispatch) {
    const visitedPages = query
      ? (await UA.query(query, undefined, limit, 'large'))
      : (await UA.visited(limit));
    dispatch({ type: types.SHOW_HISTORY, visitedPages });
  };
}

export function showStars({ UA, limit }) {
  return async function(dispatch) {
    const starredItems = await UA.recentStars(limit);
    dispatch({ type: types.SHOW_STARS, starredItems });
  };
}
