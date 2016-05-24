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
import rootReducer from '../reducers';
import thunk from '../../../shared/thunk';
import * as model from '../model/index';
import * as instrument from '../../shared/instrument';
import BUILD_CONFIG from '../../../../build-config';

const instrumenter = _store => next => action => {
  if (action.instrument) {
    instrument.event('event', action.type);
  }
  return next(action);
};

export default function configureStore(initialState) {
  const middleware = [instrumenter, thunk];

  if (BUILD_CONFIG.development) {
    middleware.unshift(createLogger({
      predicate: (getState, action) => typeof action !== 'function',
      duration: true,
      collapsed: true,
      stateTransformer(state) {
        return state.toJS();
      },
    }));
  }

  if (!initialState) {
    // This gets a "blank" state that may not be renderable.
    initialState = rootReducer(undefined, { type: null });
  }

  // We want a Record, not just a Map.  Upgrade!
  initialState = new model.State(initialState);

  const store = createStore(rootReducer, initialState, applyMiddleware(...middleware));

  return store;
}
