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

import * as userAgent from '../user-agent';
import * as uuid from 'uuid';

import * as model from '../model/index';
import * as types from '../constants/action-types';
import * as profileDiffs from '../../../shared/profile-diffs';

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
                          ancestorId: ?number = undefined,
                          options: ?Object = { selected: true }): Action {
  const reason = undefined;

  return (dispatch) => {
    // We use the Page ID to associate the User Agent allocated session ID with the Page.
    const id = uuid.v4();

    // Start loading a tab while asking the User Agent to start its browsing session.
    dispatch({ type: types.CREATE_TAB, id, ancestorId, location, options, instrument: true });

    // TODO: properly track window scope.
    userAgent.api('/session/start', {
      method: 'POST',
      json: { scope: 0, ancestor: ancestorId, reason },
    })
      .then(async function (response) {
        if (!response.ok) {
          return;
        }
        const body = await response.json();
        const session = body.session;
        dispatch(didStartSession(id, session, ancestorId));
      })

      // This situation is bad for persisting browsing data, but there's nothing to
      // do! In the future, we could retry.
      .catch();
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
      userAgent.api('/session/end', {
        method: 'POST',
        json: { session: page.sessionId, reason },
      })
        .then() // Fire and forget.
        .catch(); // In the future, we could retry.
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

export function setCurrentTabPrevious(): Action {
  return { type: types.SET_CURRENT_TAB_PREVIOUS, instrument: true };
}

export function setCurrentTabNext(): Action {
  return { type: types.SET_CURRENT_TAB_NEXT, instrument: true };
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
      userAgent.api(`/query?q=${encodeURIComponent(payload.text)}`, {
        method: 'GET',
      })
        .then(async function (response) {
          if (!response.ok) {
            return;
          }
          const body = await response.json();
          dispatch(profileDiffs.completions(payload.text, body.results));
        })
        .catch(); // Right now, nothing to be done.  In the future, we could retry.
    }
  };
}

export function bookmark(session: number, url: string, title: ?string = undefined): Action {
  return dispatch => {
    // Update this window's state before telling the profile service.
    dispatch({ type: types.SET_BOOKMARK_STATE, url, isBookmarked: true, title });

    userAgent.api(`/stars/${encodeURIComponent(url)}`, {
      method: 'PUT',
      json: { title, session },
    })
      .then() // Fire and forget.
      .catch(); // Right now, nothing to be done.  In the future, we could retry.
  };
}

export function unbookmark(session: number, url: string): Action {
  return dispatch => {
    // Update this window's state before telling the profile service.
    dispatch({ type: types.SET_BOOKMARK_STATE, url, isBookmarked: false });

    userAgent.api(`/stars/${encodeURIComponent(url)}`, {
      method: 'DELETE',
      json: { session },
    })
      .then() // Fire and forget.
      .catch(); // Right now, nothing to be done.  In the future, we could retry.
  };
}

export function didStartSession(pageId: string, sessionId: number, ancestorId: ?number) {
  return { type: types.DID_START_SESSION, pageId, sessionId, ancestorId };
}
