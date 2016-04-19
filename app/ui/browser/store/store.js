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
import thunk from '../../shared/thunk';
import * as instrument from '../../shared/instrument';

const instrumenter = store => next => action => { // eslint-disable-line no-unused-vars
  if (action.instrument) {
    instrument.event('event', action.type);
  }
  return next(action);
};

export default function configureStore() {
  const logger = createLogger({
    predicate: (getState, action) => typeof action !== 'function',
    duration: true,
    collapsed: true,
    stateTransformer(state) {
      // combineReducers composes a JS object.  Assume each composed state object is an Immutable
      // instance.
      const transformed = {};
      Object.keys(state).forEach((key) => {
        transformed[key] = state[key].toJS();
      });
      return transformed;
    },
  });

  const store = createStore(rootReducer, applyMiddleware(logger, instrumenter, thunk));

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers. We need to use
    // `require` here, since native module imports don't have lazy loading
    // and need to be at the top level.
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers/index').default;
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
