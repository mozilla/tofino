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

import { logger } from '../../../shared/logging';
import { infallible, takeLatestMultiple } from '../../shared/util/saga-util';
import userAgentHttpClient from '../../../shared/user-agent-http-client';
import * as UIActions from '../actions/ui-actions';
import * as ProfileActions from '../actions/profile-actions';
import * as EffectTypes from '../constants/effect-types';

export default function*() {
  yield takeLatestMultiple({ infallible, logger },
    [EffectTypes.FETCH_LOCATION_AUTOCOMPLETIONS, fetchCompletions],
    [EffectTypes.SET_REMOTE_BOOKMARK_STATE, setRemoteBookmarkState],
    [EffectTypes.ADD_REMOTE_HISTORY, addRemoteHistory],
    [EffectTypes.ADD_REMOTE_CAPTURED_PAGE, addRemoteCapturedPage],
  );
}

export function* fetchCompletions({ pageId, text }) {
  const autocompletions = [{ url: text }];
  if (text) {
    const { results } = yield apply(userAgentHttpClient, userAgentHttpClient.query, [{ text }]);
    autocompletions.push(...results);
  }
  yield put(UIActions.setLocationAutocompletions(pageId, autocompletions));
}

export function* setRemoteBookmarkState({ page, bookmarked }) {
  const { location: url, title } = page;

  // Optimistically update the bookmark state on the local profile model to
  // offer snappy visual feedback for the user action.
  yield put(ProfileActions.setLocalBookmarkState(url, bookmarked));

  // After sending the bookmark state to the profile service, it will send
  // back an action updating the local profile model with the truth.
  if (bookmarked) {
    yield apply(userAgentHttpClient, userAgentHttpClient.createStar, [page, { url, title }]);
  } else {
    yield apply(userAgentHttpClient, userAgentHttpClient.destroyStar, [page, { url }]);
  }
}

export function* addRemoteHistory({ page }) {
  const { location: url, title } = page;
  yield apply(userAgentHttpClient, userAgentHttpClient.createHistory, [page, { url, title }]);
}

export function* addRemoteCapturedPage({ page, readerResult }) {
  const { location: url } = page;
  yield apply(userAgentHttpClient, userAgentHttpClient.createPage, [page, { url, readerResult }]);
}
