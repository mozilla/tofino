/* eslint func-names: 0 */

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
