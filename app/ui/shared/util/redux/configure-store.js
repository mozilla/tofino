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
import thunk from './middleware/thunk';
import history from './middleware/history';
import BUILD_CONFIG from '../../../../build-config';

// In webpacked environments, a `process.env.TEST` global will be created,
// with the value set to the current `TEST` flag on the environment variables.
/* eslint-disable no-undef */
const TEST = process.env.TEST;
/* eslint-enable no-undef */

export default function(rootReducer, initialState, customMiddleware = []) {
  const middleware = [thunk, ...customMiddleware];
  const historyStore = [];

  if (BUILD_CONFIG.development && !TEST) {
    middleware.unshift(createLogger({
      duration: true,
      collapsed: true,
      predicate: (getState, action) => typeof action !== 'function',
      stateTransformer: state => state.toJS(),
    }));
  }

  if (TEST) {
    middleware.unshift(history(historyStore));
  }

  const store = createStore(rootReducer, initialState, applyMiddleware(...middleware));

  // Store action history on the exposed store for tests.
  if (TEST) {
    store.history = historyStore;
  }

  return store;
}
