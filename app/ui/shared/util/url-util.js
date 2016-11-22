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

export function isHistoryRestoreUrl(url = '') {
  return url.startsWith(HISTORY_RESTORE_ADDR);
}

/**
 * Takes a URL string and if it's a history restore URL
 * with a url query param, return the parsed form of the URL.
 * So if we have a history restore URL, like
 * `tofino://historyrestore?url=http:\/\/mozilla.org`,
 * just return `url` param to not display the internals of how
 * restoration works.
 *
 * @param {String} url
 * @return {String}
 */
export function resolveHistoryRestoreUrl(url = '') {
  if (isHistoryRestoreUrl(url)) {
    // Pass in `true` as second parameter to indicate we want to parse
    // the querystring as an object.
    return parse(url, true).query.url || url;
  }
  return url;
}

/**
 * Takes a URL string and strips information to make it more
 * suitable for viewing, like stripping out common protocols
 * and subdomains.
 *
 * @param {String} url
 * @return {String}
 */
export function prettyUrl(url = '') {
  // Display the resolved URL if it's the history restore page.
  if (isHistoryRestoreUrl(url)) {
    url = resolveHistoryRestoreUrl(url);
  }

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
