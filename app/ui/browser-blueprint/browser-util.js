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
