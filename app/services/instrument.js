/**
 * Fire-and-forget module to send instrumentation to a metrics backend,
 * currently Google Analytics.
 *
 * @module instrument
 */

import { app } from 'electron';
import request from 'request';

import { googleAnalyticsTrackingID } from '../../build-config';

/**
 * Send an instrumentation payload to Google Analytics.
 *
 * @param {object} payload - Instrumentation parameters.
 * @return {Promise} A Promise resolving to null.
 */
function send(payload) {
  payload = Object.assign({}, payload, {
    v: 1,
    aip: 1, // Anonymize IP address.
    an: app.getName(),
    av: app.getVersion(),
    tid: googleAnalyticsTrackingID,
    cid: 0xdeadbeef, // Anonymous client ID for now.  TODO: track this per profile.
  });

  return new Promise((resolve, reject) => {
    request.post(
      'https://www.google-analytics.com/collect',
      { form: payload },
      (error, response, body) => { // eslint-disable-line no-unused-vars
        if (!error && response.statusCode === 200) {
          resolve();
        }
        reject(error);
      });
  }).catch(() => {});
}

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
  const payload = {
    t: 'event', // Hit type.
    ec: name, // Event category.
    ea: method, // Event action.
  };
  if (label) {
    payload.el = label;
  }
  if (value) {
    payload.ev = value;
  }
  return send(payload);
}
