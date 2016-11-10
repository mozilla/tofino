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

import { call, apply, select, put } from 'redux-saga/effects';

import { logger } from '../../../shared/logging';
import { ipcRenderer } from '../../../shared/electron';
import { infallible, Watcher, takeLatestMultiple } from '../../shared/util/saga-util';
import { serializeAppState, deserializeAppState } from '../util/session-util';
import * as ActionTypes from '../constants/action-types';
import * as EffectTypes from '../constants/effect-types';
import * as RootSelectors from '../selectors/root';
import * as RootActions from '../actions/root-actions';
import * as PageSagas from './page-sagas';
import * as SessionEffects from '../actions/session-effects';

// Sending the browser window app state to the main process to save it to the
// session store is done at most one time every second.
const SAVE_APP_STATE_THROTTLE = 1000; // ms

export default function*() {
  // It's safe to watch all actions here since we're throttling and not just
  // debouncing (potentially indefinitely if actions are dispatched constantly
  // with a lower frequency than the debounce delay). No reason to watch effects,
  // which are defined in `../constants/effect-types`, since they always
  // dispatch actions in `../constants/action-types` when having to touch the
  // app state.
  const pattern = Object.values(ActionTypes);
  const watcher = new Watcher(pattern, saveAppStateToSession, SAVE_APP_STATE_THROTTLE);

  yield takeLatestMultiple({ infallible, logger },
    [EffectTypes.SET_SESSION_KEY, setSessionKey],
    [EffectTypes.DELETE_SESSION_KEY, deleteSessionKey],
    [EffectTypes.RELOAD_WINDOW, handleWillReloadWindowAction, watcher],
    [EffectTypes.CLOSE_WINDOW, handleWillCloseWindowAction, watcher],
    [EffectTypes.START_SAVING_BROWSER_WINDOW_APP_STATE, startSavingBrowserWindowAppState, watcher],
    [EffectTypes.STOP_SAVING_BROWSER_WINDOW_APP_STATE, stopSavingBrowserWindowAppState, watcher],
    [EffectTypes.SESSION_RESTORE_BROWSER_WINDOW_APP_STATE, restoreBrowserWindowAppState],
  );
}

export function* setSessionKey({ key, value }) {
  yield apply(ipcRenderer, ipcRenderer.send, ['session-set-key', key, value]);
}

export function* deleteSessionKey({ key }) {
  yield apply(ipcRenderer, ipcRenderer.send, ['session-delete-key', key]);
}

export function* handleWillCloseWindowAction(appStateWatcher) {
  // When closing a browser window, remove it from the session.
  if (appStateWatcher.isRunning()) {
    yield call(deleteAppStateFromSession);
  } else {
    yield put(SessionEffects.notifyBrowserWindowAppStateNotWatched());
  }
}

export function* handleWillReloadWindowAction(appStateWatcher) {
  // When reloading a browser window, save it one last time to the session,
  // so that everything is guaranteed to be up to date. Otherwise, if the
  // state changes just before throttling finishes, the very latest changes
  // won't persist.
  if (appStateWatcher.isRunning()) {
    yield call(saveAppStateToSession);
  } else {
    yield put(SessionEffects.notifyBrowserWindowAppStateNotWatched());
  }
}

export function* startSavingBrowserWindowAppState(appStateWatcher) {
  yield* appStateWatcher.startIfNotRunning();
  yield put(SessionEffects.notifyBrowserWindowAppStateWatched());
}

export function* stopSavingBrowserWindowAppState(appStateWatcher) {
  yield* appStateWatcher.cancelIfRunning();
  yield put(SessionEffects.notifyBrowserWindowAppStateNotWatched());
}

export function* restoreBrowserWindowAppState({ serialized }) {
  let deserialized;

  try {
    deserialized = deserializeAppState(serialized);
  } catch (e) {
    logger.error(e);
    // If deserializing the app state fails due to a bad migration (probably
    // because the migration procedures weren't implemented yet) immediately
    // cancel the `AppStateWatcher` task if it was already running.
    // This way we avoid saving completely botched up app state as a result.
    yield put(SessionEffects.stopSavingBrowserWindowAppState());
    return;
  }

  // Overwriting the app state is a pure operation which won't have any
  // side effects, so we need to handle any additional preliminary setup
  // that has nothing to do with the app state as well, *before* overwriting.

  // Create page sessions. Since this operation is asynchronous, and simply
  // dispatching an action via `put` won't block this saga until the subsequent
  // sagas (spun up when `taking` the action) terminate, use `call` instead.
  yield call(PageSagas.bulkCreateStandalonePageSessions, { ids: deserialized.pages.ids });

  // It's now safe to overwrite the app state and start watching it for changes,
  // since any other orchestrated initialization has been finished at this point.
  yield put(RootActions.overwriteAppState(deserialized, { restoreHistory: true }));
  yield put(SessionEffects.startSavingBrowserWindowAppState());
}

export function* saveAppStateToSession() {
  // Invoked periodically when changes are made to the app state.
  const store = yield select(serializeAppState);
  const windowId = yield select(RootSelectors.getWindowId);
  yield put(SessionEffects.setSessionKey(['browserWindows', windowId], store));
  yield put(SessionEffects.notifyBrowserWindowAppStateSaved());
}

export function* deleteAppStateFromSession() {
  // Invoked just before the current browser window closes.
  const windowId = yield select(RootSelectors.getWindowId);
  yield put(SessionEffects.deleteSessionKey(['browserWindows', windowId]));
  yield put(SessionEffects.notifyBrowserWindowAppStateDestroyed());
}
