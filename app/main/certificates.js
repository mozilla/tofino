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

/* eslint-disable no-unused-vars */

import electron from 'electron';

const app = electron.app;
const ipc = electron.ipcMain;

const certificateErrors = new Map();

export function setupCertificateHandlers() {
  // http://electron.atom.io/docs/api/app/#event-certificate-error
  app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
    // Call false to continue to not trust the certifcate
    certificateErrors.set(url, { error, certificate });

    // Calling `false` on the callback explicitly rejects the cert, which causes
    // errorCode === -3 for the `did-fail-load` events on webviews, and if we don't do it,
    // the cert will fail with the appropriate error information, so do not explicitly
    // call `callback(false)`. If we wanted to make an exception, we could check
    // here and call the callback with `true`.
    // callback(false);
  });

  ipc.on('get-certificate-error', (event, { url, id }) => {
    const data = certificateErrors.get(url) || {};
    data.id = id;
    event.sender.send('get-certificate-error-response', data);
  });
}
