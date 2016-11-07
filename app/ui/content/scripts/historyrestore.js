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

const HISTORY_RESTORE_PAGE = 'tofino://historyrestore';

/**
 * Upon loading tofino://historyrestore, we check for params
 * if this is used to inject history, or redirect to a page that was injected
 * into history.
 * Inspired by Firefox iOS's implementation:
 * https://github.com/mozilla-mobile/firefox-ios/blob/75b22c3f03b07ede598293eae8bbddc241612224/Client/Assets/SessionRestore.html
 */
(function() {
  const params = parseURLParams(window.document.location);

  // If we have an `history` array and an `historyIndex`, then
  // populate this tab's history with all the items in the array.
  if (params.history) {
    const historyList = JSON.parse(unescape(params.history));
    const historyIndex = params.historyIndex ? Number(params.historyIndex) : historyList.length - 1;

    // Push pages into `window.history`
    for (let i = 0; i < historyList.length; i++) {
      const url = getRestoreURL(historyList[i]);

      // First, replace the history restore page (this page) with the first URL to be restored,
      // or for additional entries, push into the state.
      if (i === 0) {
        history.replaceState({}, '', url);
      } else {
        history.pushState({}, '', url);
      }
    }

    // Now we're on the last page pushed, but need to navigate to the selected history
    // index in the params.
    // `history.go` is relative to the current page, where 0 is the current page, -1 is back,
    // 1 is forward, etc., whereas our historyIndex is relative to the 0th element in
    // the history.
    const relativeIndex = (historyIndex - history.length) + 1;
    history.go(relativeIndex);

    // Finally, reload the page to trigger the current history item's redirection, which
    // will load the actual URL. We need to fire this using a preload script because we
    // need to use the webview's refresh method, rather than anything in content, as that
    // blows away all 'future' in the history list from the current page as it's considered
    // navigation.
    window._TOFINO_RELOAD();
  } else if (params.url) {
    // Else if we have a url in the query string, this was a history item
    // tagged to be restored due to being unable to push URLs into history
    // from different origins
    window.document.location = unescape(params.url);
  }
}());

/**
 * We need to put restore URLs as parameters of the tofino page
 * due to only being able to inject history on the same origin.
 */
function getRestoreURL(url) {
  if (url.startsWith(HISTORY_RESTORE_PAGE)) {
    return url;
  }
  return `${HISTORY_RESTORE_PAGE}?url=${escape(url)}`;
}

function parseURLParams(url) {
  const parsedURL = new URL(url);
  const params = Object.create(null);
  for (const [key, value] of parsedURL.searchParams) {
    params[key] = value;
  }
  return params;
}
