/* @flow */

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

import * as uuid from 'uuid';
import * as userAgent from '../lib/user-agent';

import * as model from '../model/index';
import * as types from '../constants/action-types';
import * as profileDiffs from '../../../shared/profile-diffs';
import { getPageById } from '../selectors/index';

// Order matters!  Flow will try the earliest first.
type Action = ((dispatch: (action: Action) => any, getState: () => Object) => any) |
              ({ type: string });

export function createTab(location: ?string = undefined,
                          ancestorId: ?number = undefined,
                          options: ?Object = { selected: true }): Action {
  const reason = undefined;

  return (dispatch) => {
    // We use the Page ID to associate the User Agent allocated session ID with the Page.
    const id = uuid.v4();

    // Start loading a tab while asking the User Agent to start its browsing session.  It's safe to
    // dispatch sequentially, since these are "plain actions".  It's unfortunate to render multiple
    // times, but c'est la vie.  If the actions change to also dispatch on future ticks, we might
    // race to set focus across user interactions.
    dispatch({ type: types.CREATE_TAB, id, ancestorId, location, options, instrument: true });
    // New tabs are opened with the URL bar focused, ready to enter a new location.
    dispatch(setShowURLBar(id, true));
    dispatch(setFocusedURLBar(id, true));

    if (options && options.selected) {
      dispatch(resetUIState()); // Reset global UI state when displaying the new tab immediately.
    }

    // TODO: properly track window scope.
    userAgent.createSession(id, { ancestor: ancestorId, reason }).then(({ session }) =>
      dispatch(didStartSession(id, session, ancestorId)));
  };
}

export function attachTab(page: model.Page): Action {
  return { type: types.ATTACH_TAB, page, instrument: true };
}

export function closeTab(pageId: string): Action {
  const reason = undefined;

  return (dispatch, getState) => {
    if (getState().pages.pages.size === 1) {
      // We never allow to close the last tab.  Instead, we dispatch to create a new tab, and
      // then close the last tab.  This does render twice, but locally it is imperceptible.
      // If we need to avoid the render, we can make a single action that sends both profile
      // commands before replacing the last tab in a single state change.  Things like
      // `redux-batch-actions` allow to do this, but that doesn't work well with our thunk
      // middleware.
      dispatch(createTab());

      // fall-through!
    }

    // Notify User Agent with sessionId before closing the tab (and losing the sessionId).
    const page = getPageById(getState(), pageId);
    if (page) {
      userAgent.destroySession(page, { reason });
    }

    dispatch({ type: types.CLOSE_TAB, pageId, instrument: true });
  };
}

export function setPageDetails(pageId: string, payload: Object): Action {
  return { type: types.SET_PAGE_DETAILS, pageId, payload, instrument: false };
}

export function setCurrentTab(pageId: string): Action {
  return { type: types.SET_CURRENT_TAB, pageId, instrument: true };
}

export function setCurrentTabPrevious(): Action {
  return { type: types.SET_CURRENT_TAB_PREVIOUS, instrument: true };
}

export function setCurrentTabNext(): Action {
  return { type: types.SET_CURRENT_TAB_NEXT, instrument: true };
}

export function setStatusText(text: string): Action {
  return { type: types.SET_STATUS_TEXT, text };
}

// Just like setUserTypedLocation, but the user didn't type it, so we
// don't trigger a search.
export function locationChanged(pageId: string, payload: Object): Action {
  return (dispatch) => {
    // Update this window's state.
    dispatch({ type: types.LOCATION_CHANGED, pageId, payload, instrument: false });
  };
}

export function resetUIState(): Action {
  return (dispatch) => {
    dispatch({ type: types.RESET_UI_STATE, instrument: false });
  };
}

export function clearCompletions(): Action {
  return (dispatch) => {
    dispatch({ type: types.CLEAR_COMPLETIONS, instrument: false });
  };
}

export function setShowURLBar(pageId: string, visible: boolean): Action {
  return (dispatch) => {
    dispatch({ type: types.SET_URL_INPUT_VISIBLE, pageId, payload: { visible } });
  };
}

export function setFocusedURLBar(pageId: string, focused: boolean): Action {
  return (dispatch) => {
    dispatch({ type: types.SET_URL_INPUT_FOCUSED, pageId, payload: { focused } });
  };
}

export function setFocusedResultIndex(index: Number): Action {
  return (dispatch) => {
    dispatch({ type: types.SET_URL_INPUT_AUTOCOMPLETE_INDEX, payload: { index } });
  };
}

export function setUserTypedLocation(pageId: string, payload: Object): Action {
  return (dispatch) => {
    // Update this window's state before telling the profile service.
    dispatch({ type: types.SET_USER_TYPED_LOCATION, pageId, payload, instrument: false });

    // Only send request to profile service if there's a non-empty input.
    // Empty input could happen if a page finishes loading and the userTyped
    // state is going to be reset.
    if (payload.text) {
      userAgent.query({ text: payload.text }).then(({ results }) =>
        dispatch(profileDiffs.completions(payload.text, results)));
    }
  };
}

export function bookmark(pageId: number, url: string, title: ?string = undefined): Action {
  return (dispatch, getState) => {
    // Update this window's state before telling the profile service.
    dispatch({ type: types.SET_BOOKMARK_STATE, url, isBookmarked: true, title });

    const page = getPageById(getState(), pageId);
    userAgent.createStar(page, { url, title });
  };
}

export function unbookmark(pageId: number, url: string): Action {
  return (dispatch, getState) => {
    // Update this window's state before telling the profile service.
    dispatch({ type: types.SET_BOOKMARK_STATE, url, isBookmarked: false });

    const page = getPageById(getState(), pageId);
    userAgent.destroyStar(page, { url });
  };
}

export function didStartSession(pageId: string, sessionId: number, ancestorId: ?number) {
  return { type: types.DID_START_SESSION, pageId, sessionId, ancestorId };
}
