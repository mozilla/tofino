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

import { applyMiddleware, createStore } from 'redux';
import createLogger from 'redux-logger';
import thunk from './thunk';
import * as instrument from './instrument';
import BUILD_CONFIG from '../../../build-config';

const instrumenter = _store => next => action => {
  if (action.instrument) {
    instrument.event('event', action.type);
  }
  return next(action);
};

/**
 * Record actions in the `history` property on the store
 * for tests.
 */
const history = historyStore => _store => next => action => {
  if (typeof action !== 'function') {
    historyStore.push(action);
  }

  return next(action);
};

export default function(rootReducer, initialState) {
  const middleware = [instrumenter, thunk];
  const historyStore = [];

  if (BUILD_CONFIG.development && !BUILD_CONFIG.test) {
    middleware.unshift(createLogger({
      duration: true,
      collapsed: true,
      predicate: (getState, action) => typeof action !== 'function',
      stateTransformer: (state) => state.toJS(),
    }));
  }

  if (BUILD_CONFIG.test) {
    middleware.unshift(history(historyStore));
  }

  const store = createStore(rootReducer, initialState, applyMiddleware(...middleware));

  // Store action history on the exposed store
  // for tests
  if (BUILD_CONFIG.test) {
    store.history = historyStore;
  }

  return store;
}
