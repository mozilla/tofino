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
const sendWindowReady = (error = false) => ipcRenderer.send('window-ready', error);
window.onerror = () => sendWindowReady(true);

// import whyDidYouUpdate from 'why-did-you-update';
// import BUILD_CONFIG from '../../build-config';

import { createBrowserStore } from './store';
import setupFrontend from './setup-frontend';
import setupUserAgentClient from './setup-uac';
import setupIPCCommunication from './setup-ipc';

// Currently the `why-did-you-update` library suffers from an uncaught
// "Maximum call stack size exceeded" error, so disable it for now.
// if (BUILD_CONFIG.development) {
//   whyDidYouUpdate(React);
// }

const store = createBrowserStore();
const userAgentClient = setupUserAgentClient({
  onConnected: sendWindowReady,
  onDiff: store.dispatch,
});

setupFrontend({ store, userAgentClient });
setupIPCCommunication({ store, userAgentClient });
