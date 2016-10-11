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

import { EventEmitter } from 'events';

/**
 * A utility class that extends EventEmitter to receive page IDs and
 * emit events to be consumed by a WebView owner (in our case, page.jsx).
 * The main Browser component (browser.jsx) creates a WebViewController,
 * and each Page component listens to it for any actions it should take,
 * like `navigate-back:${pageId}`.
 */
export default class WebViewController extends EventEmitter {
  navigateBack(pageId) {
    this.emit('navigate-back', pageId);
    this.emit(`navigate-back:${pageId}`, pageId);
  }

  navigateForward(pageId) {
    this.emit('navigate-forward', pageId);
    this.emit(`navigate-forward:${pageId}`, pageId);
  }

  navigateTo(pageId, location) {
    this.emit('navigate-to', pageId, location);
    this.emit(`navigate-to:${pageId}`, pageId, location);
  }

  navigateInHistory(pageId, historyIndex) {
    this.emit('navigate-in-history', pageId, historyIndex);
    this.emit(`navigate-in-history:${pageId}`, pageId, historyIndex);
  }

  navigateRefresh(pageId) {
    this.emit('navigate-refresh', pageId);
    this.emit(`navigate-refresh:${pageId}`, pageId);
  }

  capturePage(pageId) {
    this.emit('capture-page', pageId);
    this.emit(`capture-page:${pageId}`, pageId);
  }

  toggleDevtools(pageId) {
    this.emit('toggle-devtools', pageId);
    this.emit(`toggle-devtools:${pageId}`, pageId);
  }
}
