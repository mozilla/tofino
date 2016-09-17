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

import assert from 'assert';
import { EventEmitter } from 'events';

import { isUUID } from './uuid-util';

const getPageIndexById = (pages, id) => pages.findIndex(p => p.id === id);

/**
 * A utility class that extends EventEmitter to receive page IDs and
 * emit events to be consumed by a WebView owner (in our case, page.jsx).
 * The main Browser component (browser.jsx) creates a WebViewController,
 * and each Page component listens to it for any actions it should take,
 * like `navigate-back:${pageId}`.
 */
export default class WebViewController extends EventEmitter {
  constructor(getPages) {
    super();
    this.getPages = getPages;
  }

  navigateBack(pageId) {
    const pages = this.getPages();
    const index = getPageIndexById(pages, pageId);
    assert(index >= 0, `Page ${pageId} not found in current state.`);
    assert(isUUID(pageId), `Invalid page id: ${pageId}`);
    assert(pages.get(index).state.canGoBack, 'Page cannot go back.');

    this.emit('navigate-back', pageId);
    this.emit(`navigate-back:${pageId}`, pageId);
  }

  navigateForward(pageId) {
    const pages = this.getPages();
    const index = getPageIndexById(pages, pageId);
    assert(index >= 0, `Page ${pageId} not found in current state.`);
    assert(isUUID(pageId), `Invalid page id: ${pageId}`);
    assert(pages.get(index).state.canGoForward, 'Page cannot go forward.');

    this.emit('navigate-forward', pageId);
    this.emit(`navigate-forward:${pageId}`, pageId);
  }

  navigateTo(pageId, location) {
    const pages = this.getPages();
    const index = getPageIndexById(pages, pageId);
    assert(index >= 0, `Page ${pageId} not found in current state.`);
    assert(isUUID(pageId), `Invalid page id: ${pageId}`);
    assert(typeof location === 'string', '`location` must be a string.');

    this.emit('navigate-to', pageId, location);
    this.emit(`navigate-to:${pageId}`, pageId, location);
  }

  navigateInHistory(pageId, historyIndex) {
    const pages = this.getPages();
    const index = getPageIndexById(pages, pageId);
    assert(index >= 0, `Page ${pageId} not found in current state.`);
    assert(isUUID(pageId), `Invalid page id: ${pageId}`);
    assert(typeof historyIndex === 'number', '`historyIndex` must be a number.');

    this.emit('navigate-in-history', pageId, historyIndex);
    this.emit(`navigate-in-history:${pageId}`, pageId, historyIndex);
  }

  navigateRefresh(pageId) {
    const pages = this.getPages();
    const index = getPageIndexById(pages, pageId);
    assert(index >= 0, `Page ${pageId} not found in current state.`);
    assert(isUUID(pageId), `Invalid page id: ${pageId}`);
    assert(pages.get(index).state.canRefresh, 'Page cannot refresh.');

    this.emit('navigate-refresh', pageId);
    this.emit(`navigate-refresh:${pageId}`, pageId);
  }

  capturePage(pageId) {
    const pages = this.getPages();
    const index = getPageIndexById(pages, pageId);
    assert(index >= 0, `Page ${pageId} not found in current state.`);
    assert(isUUID(pageId), `Invalid page id: ${pageId}`);

    this.emit('capture-page', pageId);
    this.emit(`capture-page:${pageId}`, pageId);
  }

  toggleDevtools(pageId) {
    const pages = this.getPages();
    const index = getPageIndexById(pages, pageId);
    assert(index >= 0, `Page ${pageId} not found in current state.`);
    assert(isUUID(pageId), `Invalid page id: ${pageId}`);

    this.emit('toggle-devtools', pageId);
    this.emit(`toggle-devtools:${pageId}`, pageId);
  }
}
