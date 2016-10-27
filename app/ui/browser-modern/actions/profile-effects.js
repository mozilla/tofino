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

import * as EffectTypes from '../constants/effect-types';
import * as PagesSelectors from '../selectors/pages';

export function fetchLocationAutocompletions(pageId, text) {
  return {
    type: EffectTypes.FETCH_LOCATION_AUTOCOMPLETIONS,
    pageId,
    text,
  };
}

export function setRemoteBookmarkState(pageId, bookmarked) {
  return (dispatch, getState) => {
    dispatch({
      type: EffectTypes.SET_REMOTE_BOOKMARK_STATE,
      page: PagesSelectors.getPageById(getState(), pageId),
      bookmarked,
    });
  };
}

export function addRemoteHistory(pageId) {
  return (dispatch, getState) => {
    dispatch({
      type: EffectTypes.ADD_REMOTE_HISTORY,
      page: PagesSelectors.getPageById(getState(), pageId),
    });
  };
}

export function addRemoteCapturedPage(pageId, readerResult) {
  return (dispatch, getState) => {
    dispatch({
      type: EffectTypes.ADD_REMOTE_CAPTURED_PAGE,
      page: PagesSelectors.getPageById(getState(), pageId),
      readerResult,
    });
  };
}
