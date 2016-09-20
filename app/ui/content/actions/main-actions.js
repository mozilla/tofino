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

import userAgentHttpClient from '../../../shared/user-agent-http-client';
import * as types from '../constants/action-types';

export function showHistory({ query, limit }) {
  return async function(dispatch) {
    const visitedPages = query
      ? (await userAgentHttpClient.query({ query, limit, snippetSize: 'large' })).results
      : (await userAgentHttpClient.visited({ limit })).results;
    dispatch({ type: types.SHOW_HISTORY, visitedPages });
  };
}

export function showStars({ limit }) {
  return async function(dispatch) {
    const starredItems = (await userAgentHttpClient.stars({ limit })).results;
    dispatch({ type: types.SHOW_STARS, starredItems });
  };
}
