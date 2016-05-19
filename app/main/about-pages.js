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

import path from 'path';
import { protocol } from 'electron';
import { UI_DIR } from './util';

const NOT_FOUND_ERROR = 404;
const ABOUT_PROTOCOL_PREFIX = 'tofino';
const ABOUT_DIR = path.join(UI_DIR, 'about');
const ABOUT_PAGES = new Set([
  'history',
  'mozilla',
  'stars',
]);

/**
 * Registers the protocol for `about:*` pages. Must be called after
 * app's 'ready' event.
 *
 * @TODO considerations:
 * @TODO Use `protocol.registerHttpProtocol` so we can redirect invalid requests
 * to default search?
 * @TODO Proxy valid `chrome://*` URIs to `tofino://*`?
 *   https://github.com/electron/electron/issues/2618
 */
export default function() {
  protocol.registerFileProtocol(ABOUT_PROTOCOL_PREFIX, (request, callback) => {
    const pageName = request.url.substr(ABOUT_PROTOCOL_PREFIX.length + 3);
    const pagePath = path.join(ABOUT_DIR, `${pageName}.html`);
    callback(ABOUT_PAGES.has(pageName) ? pagePath : NOT_FOUND_ERROR);
  }, e => { if (e) { throw e; } });
}
