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
import { call, select, race, take, put } from 'redux-saga/effects';

import { ipcRenderer } from '../../../shared/electron';
import { wrapped, Watcher } from './helpers';
import { serializeAppState } from '../util/session-util';
import * as ActionTypes from '../constants/action-types';
import * as EffectTypes from '../constants/effect-types';
import * as RootSelectors from '../selectors/root';
import * as SessionEffects from '../actions/session-effects';

// Sending the browser window app state to the main process to save it to the
// session store is done at most one time every second.
const SAVE_APP_STATE_THROTTLE = 1000; // ms

export default function*() {
  yield [
    call(manageAppStateWatching),
    takeLatest(...wrapped(EffectTypes.SET_SESSION_KEY, setSessionKey)),
    takeLatest(...wrapped(EffectTypes.DELETE_SESSION_KEY, deleteSessionKey)),
  ];
}

function* setSessionKey({ key, value }) {
  ipcRenderer.send('session-set-key', key, value);
}

function* deleteSessionKey({ key }) {
  ipcRenderer.send('session-delete-key', key);
}

function* manageAppStateWatching() {
  // It's safe to watch all actions here since we're throttling and not just
  // debouncing (potentially indefinitely if actions are dispatched constantly
  // with a lower frequency than the debounce delay). No reason to watch effects,
  // which are defined in `../constants/effect-types`, since they always
  // dispatch actions in `../constants/action-types` when having to touch the
  // app state.
  const pattern = Object.values(ActionTypes);
  const appStateWatcher = new Watcher(pattern, saveAppStateToSession, SAVE_APP_STATE_THROTTLE);
  yield* appStateWatcher.startIfNotRunning();

    const result = yield race({
      willReloadWindow: take(EffectTypes.RELOAD_WINDOW),
      willCloseWindow: take(EffectTypes.CLOSE_WINDOW),
    });

    // When closing a browser window, remove it from the session.
    if (result.willCloseWindow) {
      yield* deleteAppStateFromSession();
    }

    // When reloading a browser window, save it one last time to the session,
    // so that everything is guaranteed to be up to date. Otherwise, if the
    // state changes just before throttling finishes, the very latest changes
    // won't persist.
    if (result.willReloadWindow) {
      yield* saveAppStateToSession();
    }

    // Make sure we're cancelling the `AppStateWatcher` task when either
    // reloading or closing the browser window, so that everything is aborted:
    // recent changes to the app state shouldn't cause the
    // `saveAppStateToSession` task to start running due to throttling.
    yield* appStateWatcher.cancelIfRunning();
}

function* saveAppStateToSession() {
  // Invoked periodically when changes are made to the app state.
  const store = yield select(serializeAppState);
  const windowId = yield select(RootSelectors.getWindowId);
  yield put(SessionEffects.setSessionKey(['browserWindows', windowId], store));
  yield put(SessionEffects.notifyBrowserWindowAppStateSaved());
}

function* deleteAppStateFromSession() {
  // Invoked just before the current browser window closes.
  const windowId = yield select(RootSelectors.getWindowId);
  yield put(SessionEffects.deleteSessionKey(['browserWindows', windowId]));
  yield put(SessionEffects.notifyBrowserWindowAppStateDestroyed());
}
