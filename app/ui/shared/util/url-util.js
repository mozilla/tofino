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

import { parse, format } from 'url';
import { HISTORY_RESTORE_ADDR } from '../../../shared/constants/endpoints';

const PROTOCOLS_TO_HIDE = new Set([
  'http:',
  'https:',
]);

const WWW_SUBDOMAIN_REGEX = /^www\./;

export function createHistoryRestoreUrl(historyURLs, historyIndex) {
  const serializedHistory = escape(JSON.stringify(historyURLs));
  return `${HISTORY_RESTORE_ADDR}/?history=${serializedHistory}&historyIndex=${historyIndex}`;
}

/**
 * Takes a URL string and strips information to make it more
 * suitable for viewing, like stripping out common protocols
 * and subdomains.
 *
 * @param {String} url
 * @return {String}
 */
export function prettyUrl(url) {
  const parsedUrl = parse(url);

  // Remove the protocol from being displayed if it's
  // a common one
  const hideProtocol = PROTOCOLS_TO_HIDE.has(parsedUrl.protocol);

  if (hideProtocol) {
    delete parsedUrl.protocol;
  }

  // Strip subdomain if it's just 'www'
  if (parsedUrl.host) {
    parsedUrl.host = parsedUrl.host.replace(WWW_SUBDOMAIN_REGEX, '');
  }

  let formattedUrl = format(parsedUrl);

  // If we're hiding the protocol, also strip the "//"
  if (hideProtocol) {
    formattedUrl = formattedUrl.substr(2);
  }

  return formattedUrl;
}
