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

import { protocol, app } from 'electron';
import * as endpoints from '../shared/constants/endpoints';

const tofinoColonSlash = new RegExp(`^${endpoints.TOFINO_PROTOCOL}:/`);

export const DEFAULT_PROTOCOLS = ['http', 'https', endpoints.TOFINO_PROTOCOL];

export function registerStandardSchemes() {
  protocol.registerStandardSchemes(DEFAULT_PROTOCOLS);
}

/**
 * Registers the protocol for `tofino://*` pages. Must be called after
 * app's 'ready' event.
 *
 * @TODO Proxy valid `chrome://*` URIs to `tofino://*`?
 *   https://github.com/electron/electron/issues/2618
 */
export function registerHttpProtocols() {
  protocol.registerHttpProtocol(endpoints.TOFINO_PROTOCOL, (request, callback) => {
    const redirectPath = request.url
      .replace(tofinoColonSlash, `${endpoints.CONTENT_SERVER_HTTP}`);

    callback({
      method: request.method,
      referrer: request.referrer,
      url: redirectPath,
    });
  }, e => { if (e) { throw e; } });
}

export function setDefaultBrowser() {
  const success = [];
  for (const p of DEFAULT_PROTOCOLS) {
    success.push(app.setAsDefaultProtocolClient(p));
  }

  return success.every(s => s);
}

export function isDefaultBrowser() {
  return DEFAULT_PROTOCOLS.every(p => app.isDefaultProtocolClient(p));
}
