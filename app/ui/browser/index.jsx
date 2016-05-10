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

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ipcRenderer } from '../../shared/electron';

import App from './views/app';
import configureStore from './store/store';
import * as actions from './actions/main-actions';
import * as profileDiffs from '../../shared/profile-diffs';
import BUILD_CONFIG from '../../../build-config';

import WebSocket from 'ws';

const store = configureStore();

// Make the store accessible from the ipcRenderer singleton
// so we can easily access in tests
if (BUILD_CONFIG.test) {
  ipcRenderer.store = store;
}

const chrome = (
  <Provider store={store}>
    <App />
  </Provider>
);

const container = document.getElementById('browser-container');

const onRender = () => ipcRenderer.send('window-ready');

// Before rendering, add a fresh tab and prepare the cached profile data.  This is leading toward a
// session restore model where the main process can instantiate a mostly-formed browser window.
// The reason to dispatch actions is that some actions start asynchronous processes, and we
// can't necessarily produce the resulting state (which is supposed to be the initial state
// presented to the user).  Dispatching actions also uses the same codepaths the rest of the
// application uses.

const ws = new WebSocket('ws://localhost:9090/diffs');

ws.on('open', () => {
  // Nothing for now.
});

ws.on('message', (data, flags) => {
  // flags.binary will be set if a binary data is received.
  // flags.masked will be set if the data was masked.
  if (flags.binary) {
    return;
  }
  const command = JSON.parse(data);
  if (!command) {
    return;
  }

  console.log(`got command ${data}`);

  if (command.type === 'initial') {
    if (command.payload.stars) {
      store.dispatch(profileDiffs.bookmarks(command.payload.stars));
    }
    store.dispatch(actions.createTab());

    ReactDOM.render(chrome, container, onRender);

    return;
  }

  // It's dangerous to trust the service in this way, but good enough for now.
  store.dispatch(command);
});
