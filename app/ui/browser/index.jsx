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

/* eslint import/imports-first: "off" */

import { ipcRenderer } from '../../shared/electron';

// In the case of uncaught error, which is often due to compilation failures, be sure to tell the
// main process that this window is ready to display -- even if it really isn't.  The main process
// will then show the window (if it hasn't already) which allows the Browser devtools to debug the
// underlying issue.
const onWindowReady = (error = false) => ipcRenderer.send('window-ready', error);

window.onerror = (_message, _source, _lineno, _colno, _error) => {
  onWindowReady(true);
};

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from './views/app';
import configureStore from './store/store';
import * as actions from './actions/main-actions';
import * as profileDiffs from '../../shared/profile-diffs';
import BUILD_CONFIG from '../../../build-config';
import UserAgentClient from '../../shared/user-agent-client';

const userAgentClient = new UserAgentClient();

const store = configureStore();

const chrome = (
  <Provider store={store}>
    <App />
  </Provider>
);

// The `app` object gets exposed via `window` in tests. Attach
// objects to app if and only if they should be accessible in tests.
const app = {
  store,
};

if (BUILD_CONFIG.test) {
  window.app = app;

  // Make the store accessible from the ipcRenderer singleton
  // so we can easily access in tests
  ipcRenderer.store = store;
}

const container = document.getElementById('browser-container');

// Before rendering, add a fresh tab.  This is leading toward a session restore model where the
// main process can instantiate a mostly-formed browser window.  The reason to dispatch actions
// is that some actions start asynchronous processes, and we can't necessarily produce the
// resulting state (which is supposed to be the initial state presented to the user).
// Dispatching actions also uses the same codepaths the rest of the application uses.

// We can dispatch our fresh tab before connecting to the UA service.
store.dispatch(actions.createTab());

// We start rendering before we connect to the UA service and before we receive the initial state so
// that if an error occurs while we connect, we at least have some UI in place.
ReactDOM.render(chrome, container);

userAgentClient.connect().then(() => onWindowReady(true));
userAgentClient.on('diff', (command) => {
  if (command.type === 'initial') {
    if (command.payload.stars) {
      store.dispatch(profileDiffs.bookmarks(command.payload.stars));
    }

    // We've connected to the UA service, received the initial state, and (synchronously)
    // rendered the initial UI.  This window is ready to display!
    onWindowReady();

    return;
  }

  // It's dangerous to trust the service in this way, but good enough for now.
  store.dispatch(command);
});
