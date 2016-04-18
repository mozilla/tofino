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
 * Send instrumentation messages to the main process instrument
 * service.  This just provides a typed interface instead of message
 * passing inline.
 *
 * @module instrument
 */

// Stub out ipcRenderer when electron cannot be found (unit tests)
const ipcRenderer = (function() {
  try {
    return require('electron').ipcRenderer;
  } catch (e) {
    return { send() {} };
  }
}());

/**
 * Send an instrumentation event to Google Analytics.
 *
 * @param {string} name - Event name or category; equivalent to UI Telemetry's event.
 * @param {string} method - Event method or action; equivalent to UI Telemetry's method.
 * @param {string} [label] - Optional label.
 * @param {integer} [value] - Optional value.
 * @return {Promise} A Promise resolving to null.
 */
export function event(name, method, label = null, value = null) {
  ipcRenderer.send('instrument-event', { name, method, label, value });
}
