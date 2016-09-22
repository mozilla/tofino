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

/**
 * This module is to expose constants that need to be accessible
 * throughout the main process, like electron.app state and
 * singleton classes, like UserAgentService.
 */

import electron from 'electron';
import Deferred from '../shared/deferred';
import UserAgentClient from '../shared/user-agent-client';

const { ipcMain } = electron;

// Expose the UserAgentClient singleton
export const userAgentClient = new UserAgentClient();

// Constant promise used to signal elsewhere in the main process
// that the application has launched and finished loading
// the initial browser window
const appInitializedDeferred = new Deferred();
export const INITIALIZED = appInitializedDeferred.promise;
ipcMain.once('main:first-window-created', appInitializedDeferred.resolve);
