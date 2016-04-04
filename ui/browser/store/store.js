
import { applyMiddleware, createStore } from 'redux';
import createLogger from 'redux-logger';
import rootReducer from '../reducers';

export default function configureStore() {
  const logger = createLogger({
    duration: true,
    collapsed: true,
    stateTransformer(state) { return state.toJS(); },
  });

  const store = createStore(rootReducer, applyMiddleware(logger));

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers/index').default;
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
