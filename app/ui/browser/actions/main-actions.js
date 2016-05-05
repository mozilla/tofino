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

import * as model from '../model/index';
import * as types from '../constants/action-types';
import * as profileDiffs from '../../../shared/profile-diffs';
import * as profileCommands from '../../../shared/profile-commands';

// Order matters!  Flow will try the earliest first.
type Action = ((dispatch: (action: Action) => any, getState: () => Object) => any) |
              ({ type: string });

/**
 * If pageId corresponds to a non-null open page, synchronously invoke callback(page).
 * Otherwise, do nothing.
 *
 * @param state current top-level state.
 * @param pageId to find.
 * @param callback to invoke.
 */
function maybeWithPageById(state: Object, pageId: string, callback: any): void {
  const pageIndex = state.pages.pages.findIndex(page => page.id === pageId);
  if (pageIndex < 0) {
    return;
  }
  const page = state.pages.pages.get(pageIndex);
  if (!page) {
    return;
  }
  callback(page);
}

export function createTab(location: ?string = undefined,
                          ancestorId: ?number = undefined): Action {
  const reason = undefined;

  return (dispatch) => {
    // We use the Page ID to associate the User Agent allocated session ID with the Page.
    const id = uuid.v4();

    // Start loading a tab while asking the User Agent to start its browsing session.
    dispatch({ type: types.CREATE_TAB, id, ancestorId, location, instrument: true });

    profileCommands.request(profileCommands.startSession(ancestorId, reason))
      .then(({ sessionId }) => {
        dispatch(didStartSession(id, sessionId, ancestorId));
      })
      .catch(); // This situation is bad for persisting browsing data, but there's nothing to do!
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
    maybeWithPageById(getState(), pageId, (page) => {
      if (page.sessionId) {
        profileCommands.send(profileCommands.endSession(page.sessionId, reason));
      }
    });

    dispatch({ type: types.CLOSE_TAB, pageId, instrument: true });
  };
}

export function setPageDetails(pageId: string, payload: Object): Action {
  return { type: types.SET_PAGE_DETAILS, pageId, payload, instrument: false };
}

export function setCurrentTab(pageId: string): Action {
  return { type: types.SET_CURRENT_TAB, pageId, instrument: true };
}

export function setStatusText(text: string): Action {
  return { type: types.SET_STATUS_TEXT, text };
}

export function setUserTypedLocation(pageId: string, payload: Object): Action {
  return (dispatch) => {
    // Update this window's state before telling the profile service.
    dispatch({ type: types.SET_USER_TYPED_LOCATION, pageId, payload, instrument: false });

    // Only send request to profile service if there's a non-empty input.
    // Empty input could happen if a page finishes loading and the userTyped
    // state is going to be reset.
    if (payload.text) {
      profileCommands.request(profileCommands.setUserTypedLocation(payload.text))
        .then(({ text, completionList }) => {
          dispatch(profileDiffs.completions(text, completionList));
        })
        .catch(); // Ignore failures.  Not much to be done here.
    }
  };
}

export function bookmark(sessionId: number, url: string, title: ?string = undefined): Action {
  return dispatch => {
    // Update this window's state before telling the profile service.
    dispatch({ type: types.SET_BOOKMARK_STATE, url, isBookmarked: true, title });

    if (sessionId) {
      profileCommands.send(profileCommands.bookmark(sessionId, url, title));
    }
  };
}

export function unbookmark(sessionId: number, url: string): Action {
  return dispatch => {
    // Update this window's state before telling the profile service.
    dispatch({ type: types.SET_BOOKMARK_STATE, url, isBookmarked: false });

    if (sessionId) {
      profileCommands.send(profileCommands.unbookmark(sessionId, url));
    }
  };
}

export function navigatePageTo(pageId: string, location: string) {
  return { type: types.NAVIGATE_PAGE_TO, pageId, location };
}

export function navigatePageBack(pageId: string) {
  return { type: types.NAVIGATE_PAGE_BACK, pageId };
}

export function navigatePageForward(pageId: string) {
  return { type: types.NAVIGATE_PAGE_FORWARD, pageId };
}

export function navigatePageRefresh(pageId: string) {
  return { type: types.NAVIGATE_PAGE_REFRESH, pageId };
}

export function didStartSession(pageId: string, sessionId: number, ancestorId: ?number) {
  return { type: types.DID_START_SESSION, pageId, sessionId, ancestorId };
}
