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

import { createTab, setPageOrder } from '../../actions/main-actions';
import { getBestDropItem, getWebView } from '../../browser-util';

/* This is a dirty hack around Blink not supporting relatedTarget in dragleave
   events (https://bugs.chromium.org/p/chromium/issues/detail?id=159534).
   currentDragTarget should be correct for any dragleave handlers deeper in the
   DOM. */
let currentDragTarget;
window.addEventListener('dragenter', ev => currentDragTarget = ev.target, true);
window.addEventListener('dragleave', () => currentDragTarget = null);
window.addEventListener('dragend', () => currentDragTarget = null);

/**
 *
 */
export class TabDragDrop {
  constructor(page, pageOrder, pageIndex, ipcRenderer) {
    this.page = page;
    this.pageIndex = pageIndex;
    this.pageOrder = pageOrder;
    this.ipcRenderer = ipcRenderer;

    this.handlers = {
      onDragStart: this.onDragStart.bind(this),
      onDragEnd: this.onDragEnd.bind(this),
      onDragEnter: this.onDragEnter.bind(this),
      onDrop: this.onDrop.bind(this),
    };
  }

  onDragStart(e) {
    const { pageIndex, pageOrder } = this;

    const tabIndex = pageOrder.indexOf(pageIndex);
    // e.dataTransfer.setData('text/uri-list', page.location);
    // e.dataTransfer.setData('text/plain', page.location);
    e.dataTransfer.setData('application/vnd.mozilla.bh.page',
                           JSON.stringify({ pageIndex, tabIndex }));
    e.dataTransfer.effectAllowed = 'copyMove';
  }

  onDragEnd(e) {
    const { page, pageIndex } = this;

    if (e.dataTransfer.dropEffect === 'none') {
      const webview = getWebView(e.target.ownerDocument, pageIndex);
      const guestInstanceId = webview.guestinstance;
      this.ipcRenderer.send('tab-detach', { page, guestInstanceId });
    }
  }

  onDragEnter(e) {
    const item = getBestDropItem(e.dataTransfer);
    if (item.type === 'text/uri-list' || item.type === 'text/plain') {
      e.dataTransfer.dropEffect = 'copy';
      e.preventDefault();
    }
  }

  onDrop(e) {
    const { pageIndex } = this;

    const item = getBestDropItem(e.dataTransfer);
    if (item.type === 'text/uri-list' || item.type === 'text/plain') {
      const url = e.dataTransfer.getData(item.type);

      const webview = getWebView(e.target.ownerDocument, pageIndex);
      webview.setAttribute('src', url);

      e.dataTransfer.dropEffect = 'copy';
      e.preventDefault();
    }
  }
}

/**
 *
 */
export class TabBarDragDrop {
  constructor(pages, pageOrder, dispatch) {
    this.pages = pages;
    this.pageOrder = pageOrder;
    this.dispatch = dispatch;

    this.handlers = {
      onDragEnter: this.onDragEnter.bind(this),
      onDragOver: this.onDragOver.bind(this),
      onDragLeave: this.onDragLeave.bind(this),
      onDrop: this.onDrop.bind(this),
    };
  }

  onDragEnter(e) {
    const { pages, pageOrder } = this;

    if (e.defaultPrevented) {
      return;
    }

    const item = getBestDropItem(e.dataTransfer);
    if (!item) {
      return;
    }

    if (item.type === 'text/uri-list' || item.type === 'text/plain') {
      // A tab would have cancelled this event already so this is dragging to
      // a new tab
      e.dataTransfer.dropEffect = 'copy';
      e.preventDefault();
      return;
    }

    // Dropping a tab
    const dragData = JSON.parse(e.dataTransfer.getData('application/vnd.mozilla.bh.page'));

    // Find the tab target or default to the last tab
    const document = e.target.ownerDocument;
    let tabIndex = pageOrder.size - 1;
    for (let i = 0; i < pages.size ; i++) {
      const element = document.querySelector(`.browser-tab-${i}`);
      if (element.contains(e.target)) {
        tabIndex = pageOrder.indexOf(i);
        break;
      }
    }

    if (pageOrder[tabIndex] !== dragData.pageIndex) {
      // Mutate the tab order so the dragged page appears at tabIndex
      const newPageOrder = pageOrder.filter(p => p !== dragData.pageIndex);
      newPageOrder.splice(tabIndex, 0, dragData.pageIndex);
      this.dispatch(setPageOrder(newPageOrder));
    }

    e.dataTransfer.dropEffect = 'move';
    e.preventDefault();
  }

  onDragOver(e) {
    const item = getBestDropItem(e.dataTransfer);
    if (item) {
      e.preventDefault();
    }
  }

  onDragLeave(e) {
    const { pageOrder } = this;

    // If we've just entered a descendent then ignore the event
    if (e.currentTarget.contains(currentDragTarget)) {
      return;
    }

    const data = e.dataTransfer.getData('application/vnd.mozilla.bh.page');
    if (data) {
      const dragData = JSON.parse(data);
      // Move the tab back to its original index
      const newPageOrder = pageOrder.filter(p => p !== dragData.pageIndex);
      newPageOrder.splice(dragData.tabIndex, 0, dragData.pageIndex);
      this.dispatch(setPageOrder(newPageOrder));
    }
  }

  onDrop(e) {
    if (e.defaultPrevented) {
      return;
    }

    const item = getBestDropItem(e.dataTransfer);
    if (!item) {
      return;
    }
    e.preventDefault();

    if (item.type === 'text/uri-list' || item.type === 'text/plain') {
      // A tab would have cancelled this event already so this is dragging to
      // a new tab
      const url = e.dataTransfer.getData(item.type);
      createTab(url);
      e.dataTransfer.dropEffect = 'copy';
      return;
    }

    // Dropping a tab. The mutation will have already been taken care of in
    // onDragEnterTabBar
    e.dataTransfer.dropEffect = 'move';
  }
}
