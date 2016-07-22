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

import os from 'os';
import { setInterval } from 'timers';
import { app, autoUpdater, dialog } from 'electron';
import { version as appVersion, name as appName } from '../../package.json';

// Check once an hour
const UPDATE_CHECK_TIME = 1000 * 60 * 60;

// Exe name is set to the same as the package name
app.setAppUserModelId(`com.squirrel.${appName}.${appName}`);

try {
  autoUpdater.setFeedURL(`https://tofino-update-server.herokuapp.com/update/${os.platform()}_${os.arch()}/${appVersion}`);
} catch (e) {
  // This happens when the application isn't code signed on OSX.
}

autoUpdater.on('update-downloaded', () => {
  dialog.showMessageBox({
    type: 'question',
    title: 'Update Available',
    message: 'An update is available, would you like to install it?',
    buttons: ['Yes', 'No'],
    defaultId: 0,
    cancelId: 1,
  }, response => {
    if (response === 0) {
      autoUpdater.quitAndInstall();
    }
  });
});

function checkForUpdates() {
  try {
    autoUpdater.checkForUpdates();
  } catch (e) {
    // This happens if the app isn't installed
  }
}

export function startUpdateChecks() {
  checkForUpdates();

  setInterval(checkForUpdates, UPDATE_CHECK_TIME);
}
