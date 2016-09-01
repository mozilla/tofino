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

// In the case of uncaught error, which is often due to compilation failures,
// be sure to tell the main process that this window is ready to display
// even if it really isn't. The main process will then show the window (if it
// hasn't already) which allows the browser devtools to debug the underlying issue.
const onWindowReady = (error = false) => ipcRenderer.send('window-ready', error);
window.onerror = () => onWindowReady(true);

import React from 'react';
import ReactDOM from 'react-dom';
import whyDidYouUpdate from 'why-did-you-update';
import { Provider } from 'react-redux';

import App from './views/app';
import * as PageActions from './actions/page';
import * as UIActions from './actions/ui';
import * as PagesSelectors from './selectors/pages';
import { createBrowserStore } from './store';
import UserAgentClient from '../../shared/user-agent-client';

whyDidYouUpdate(React);

const userAgentClient = new UserAgentClient();
const store = createBrowserStore();

const chrome = (
  <Provider store={store}>
    <App />
  </Provider>
);

const container = document.getElementById('browser-container');

// Before rendering, add a fresh page. This is leading toward a session restore
// model where the main process can instantiate a mostly-formed browser window.
// The reason to dispatch actions is that some actions start asynchronous processes,
// and we can't necessarily produce the resulting state (which is supposed to be
// the initial state presented to the user). Dispatching actions also uses the
// same codepaths the rest of the application uses.

// We can dispatch our fresh page before connecting to the UA service.
store.dispatch(PageActions.createPage());

// We start rendering before we connect to the UA service and before we receive
// the initial state so that if an error occurs while we connect, we at least
// have some UI in place.
ReactDOM.render(chrome, container);

// Set max listeners to Infinity, because each new page will listen to more
// events, and we'll intentionally go beyond the 10 listener default.
ipcRenderer.setMaxListeners(Infinity);

// Wait until the main process negotiates an address for the UA service, and
// then subsequently connect.
ipcRenderer.on('user-agent-service-info', (_, { port, version, host }) => {
  userAgentClient.connect({ port, version, host });
});

userAgentClient.on('diff', (command) => {
  if (command.type === 'initial') {
    // We've connected to the UA service, received the initial state, and
    // (synchronously) rendered the initial UI. This window is ready to display!
    onWindowReady();
    return;
  }

  // It's dangerous to trust the service in this way, but good enough for now.
  store.dispatch(command);
});

// Add other various main process event listeners.
ipcRenderer.on('new-tab', () => {
  store.dispatch(PageActions.createPage());
});

ipcRenderer.on('close-tab', () => {
  const selectedPageId = PagesSelectors.getSelectedPageId(store.getState());
  store.dispatch(PageActions.removePage(selectedPageId));
});

ipcRenderer.on('select-tab-previous', () => {
  store.dispatch(PageActions.setSelectedPagePrevious());
});

ipcRenderer.on('select-tab-next', () => {
  store.dispatch(PageActions.setSelectedPageNext());
});

ipcRenderer.on('select-tab-index', (_, index) => {
  store.dispatch(PageActions.setSelectedPageIndex(index));
});

ipcRenderer.on('show-page-search', (_, index) => {
  store.dispatch(UIActions.showPageSearch(index));
});

ipcRenderer.on('hide-page-search', (_, index) => {
  store.dispatch(UIActions.hidePageSearch(index));
});
