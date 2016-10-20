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

import { put, apply } from 'redux-saga/effects';

import { takeLatestMultiple, infallible } from '../../shared/util/saga-util';
import userAgentHttpClient from '../../../shared/user-agent-http-client';
import * as EffectTypes from '../constants/effect-types';
import * as MainActions from '../actions/main-actions';

export default function*() {
  yield takeLatestMultiple(
    [EffectTypes.FETCH_HISTORY, infallible(fetchHistory, console)],
    [EffectTypes.FETCH_STARS, infallible(fetchStars, console)],
  );
}

export function* fetchHistory({ query, limit }) {
  const visitedPages = query
    ? yield apply(userAgentHttpClient, userAgentHttpClient.query, [{
      limit,
      text: query,
      snippetSize: 'large',
    }])
    : yield apply(userAgentHttpClient, userAgentHttpClient.visited, [{
      limit,
    }]);

  yield put(MainActions.showHistory(visitedPages.results));
}

export function* fetchStars({ limit }) {
  const starredItems = yield apply(userAgentHttpClient, userAgentHttpClient.starredItems, [{
    limit,
  }]);

  yield put(MainActions.showStars(starredItems.results));
}
