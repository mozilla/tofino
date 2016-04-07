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
import * as instrument from '../../shared/instrument';

const instrumenter = store => next => action => { // eslint-disable-line no-unused-vars
  if (action.instrument) {
    instrument.event('event', action.type);
  }
  return next(action);
};

export default function configureStore() {
  const logger = createLogger({
    duration: true,
    collapsed: true,
    stateTransformer(state) { return state.toJS(); },
  });

  const store = createStore(rootReducer, applyMiddleware(logger, instrumenter));

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers/index').default;
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
