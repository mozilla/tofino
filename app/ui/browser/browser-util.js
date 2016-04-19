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

import UrlUtil from '../shared/url-util';

/**
 * Given a search query, format it into a search engine's URL
 */
export function getSearchURL(query) {
  // See https://dxr.mozilla.org/mozilla-central/source/browser/locales/en-US/searchplugins
  // for a list of providers.
  return `https://www.duckduckgo.com/?q=${encodeURIComponent(query)}`;
}

/**
 * Convert whatever the user typed into the URL bar into an actual URL
 */
export function fixURL(typed) {
  if (UrlUtil.isDataUrl(typed)) {
    return typed;
  }

  // @TODO: The %20 here is to handle 'www.blah.com foo' as a search,
  // but it doesn't handle cases where spaces are included in GET params
  const isURL = UrlUtil.isURL(typed) && (
                  typed.includes('%20') ||
                  !UrlUtil.getUrl(typed).path.includes('%20'));

  if (isURL) {
    return UrlUtil.getUrlFromInput(typed);
  }

  return getSearchURL(typed);
}

/**
 *
 */
export function getBestDropItem(dataTransfer) {
  let uriitem = null;
  let textitem = null;
  for (const item of dataTransfer.items) {
    if (item.type === 'application/vnd.mozilla.bh.page') {
      return item;
    }
    if (item.type === 'text/uri-list') {
      uriitem = item;
    }
    if (item.type === 'text/plain') {
      textitem = item;
    }
  }
  return uriitem || textitem;
}

const UUID_REGEX = /[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}/;
export function isUUID(uuidString) {
  return UUID_REGEX.test(uuidString);
}

/**
 *
 */
export function getCurrentWebView(document) {
  return document.querySelector('.active-browser-page > webview');
}

/**
 *
 */
export function getWebView(document, pageIndex) {
  const element = document.querySelector(`.webview-${pageIndex}`);
  if (element == null) {
    throw new Error(`No webview for page at index ${pageIndex}`);
  }
  return element.webview;
}
