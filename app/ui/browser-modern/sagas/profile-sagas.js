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

import { takeLatest } from 'redux-saga';
import { put, call } from 'redux-saga/effects';

import { wrapped } from './helpers';
import * as UserAgent from '../../shared/util/user-agent';
import * as UIActions from '../actions/ui-actions';
import * as ProfileActions from '../actions/profile-actions';
import * as EffectTypes from '../constants/effect-types';

export default function() {
  return [
    function*() {
      yield* takeLatest(...wrapped(EffectTypes.FETCH_LOCATION_AUTOCOMPLETIONS, fetchCompletions));
    },
    function*() {
      yield* takeLatest(...wrapped(EffectTypes.SET_REMOTE_BOOKMARK_STATE, setRemoteBookmarkState));
    },
    function*() {
      yield* takeLatest(...wrapped(EffectTypes.ADD_REMOTE_HISTORY, addRemoteHistory));
    },
    function*() {
      yield* takeLatest(...wrapped(EffectTypes.ADD_CAPTURED_PAGE, addCapturedPage));
    },
  ];
}

function* fetchCompletions({ text }) {
  const autocompletions = [{ uri: text }];
  if (text) {
    const { results } = yield call(UserAgent.query, { text });
    autocompletions.push(...results);
  }
  yield put(UIActions.setLocationAutocompletions(autocompletions));
}

function* setRemoteBookmarkState({ page, bookmarked }) {
  const { location: url, title } = page;

  // Optimistically update the bookmark state on the local profile model to
  // offer snappy visual feedback for the user action.
  yield put(ProfileActions.setLocalBookmarkState(url, bookmarked));

  // After sending the bookmark state to the profile service, it will send
  // back an action updating the local profile model with the truth.
  if (bookmarked) {
    yield call(UserAgent.createStar, page, { url, title });
  } else {
    yield call(UserAgent.destroyStar, page, { url });
  }
}

function* addRemoteHistory({ page }) {
  const { location: url, title } = page;
  yield call(UserAgent.createHistory, page, { url, title });
}

function* addCapturedPage({ page, readerResult }) {
  const { location: url } = page;
  yield call(UserAgent.createPage, page, { url, readerResult });
}
