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

import { takeLatest, throttle } from 'redux-saga';
import { race, call, take, put, select } from 'redux-saga/effects';

import { ipcRenderer } from '../../../shared/electron';
import { wrapped } from './helpers';
import { getWindowId } from '../selectors/ui';
import { serializeAppState, deserializeAppState } from '../util/session-util';
import * as ActionTypes from '../constants/action-types';
import * as EffectTypes from '../constants/effect-types';
import * as RootAction from '../actions/root-actions';
import * as PageEffects from '../actions/page-effects';
import * as SessionEffects from '../actions/session-effects';

const THROTTLE_DURATION = 1000; // ms

export default function*() {
  yield [
    takeLatest(...wrapped(EffectTypes.GET_SESSION_KEY, getSessionKey)),
    takeLatest(...wrapped(EffectTypes.SET_SESSION_KEY, setSessionKey)),
    takeLatest(...wrapped(EffectTypes.DEL_SESSION_KEY, delSessionKey)),
    takeLatest(...wrapped(EffectTypes.RESTORE_SERIALIZED_APP_STATE, restoreSerializedAppState)),
  ];

  // Make sure we're cancelling the `watchAppStateChanges` task when closing
  // browser windows, so that everything is aborted even if recent actions
  // cause the `saveAppStateToSession` task to start running due to throttling.
  yield race([call(watchAppStateChanges, saveAppStateToSession), take(EffectTypes.CLOSE_WINDOW)]);
  yield deleteAppStateFromSession();
}

function* getSessionKey({ key }) {
  ipcRenderer.send('session:getkey', key);
}

function* setSessionKey({ key, value }) {
  ipcRenderer.send('session:setkey', key, value);
}

function* delSessionKey({ key }) {
  ipcRenderer.send('session:delkey', key);
}

function* watchAppStateChanges(fn) {
  // It's safe to watch all actions here since we're throttling and not just
  // debouncing (potentially indefinitely if actions are dispatched constantly
  // with a lower frequency than the debounce delay). No reason to watch effects,
  // which are defined in `../constants/effect-types`, since they always
  // dispatch actions in `../constants/action-types` when having to touch the
  // app state.
  const pattern = Object.values(ActionTypes);
  yield throttle(THROTTLE_DURATION, ...wrapped(pattern, fn));
}

function* restoreSerializedAppState({ serialized }) {
  const deserialized = deserializeAppState(serialized);

  // Overwriting the app state is a pure operation which won't have any
  // side effects, so we need to handle any additional preliminary setup
  // that has nothing to do with the app state.

  // Create page sessions for communicating with the user agent service.
  for (const id of deserialized.pages.ids) {
    yield put(PageEffects.createPageSession(null, null, id, { withUI: false }));
  }

  yield put(RootAction.overwriteAppState(deserialized));
}

function* saveAppStateToSession() {
  // Invoked periodically when changes are made to the app state.
  const store = yield select(serializeAppState);
  const windowId = yield select(getWindowId);
  yield put(SessionEffects.setSessionKey(['browserWindows', windowId], store));
  yield put(SessionEffects.notifyBrowserWindowAppStateSaved());
}

function* deleteAppStateFromSession() {
  // Invoked just before the current browser window closes.
  const windowId = yield select(getWindowId);
  yield put(SessionEffects.delSessionKey(['browserWindows', windowId]));
  yield put(SessionEffects.notifyBrowserWindowAppStateDestroyed());
}
