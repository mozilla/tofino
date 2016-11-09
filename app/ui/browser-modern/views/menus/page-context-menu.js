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

import Deferred from '../../../../shared/deferred';
import { remote } from '../../../../shared/electron';
import * as PageEffects from '../../actions/page-effects';
import * as ClipboardEffects from '../../actions/clipboard-effects';

const { Menu, MenuItem } = remote;

/**
 * Creates a context menu for some web contents given a pageId and some
 * information on what the context menu should be about. Returns a promise
 * resolved with an action when one of the menu items is picked.
 */
export default class PageContextMenu {
  constructor(pageId, options) {
    this._pageId = pageId;
    this._data = options;
  }

  popup(win) {
    const menu = new Menu();
    const choice = new Deferred();

    menu.append(new MenuItem({
      label: 'Back',
      click: () => choice.resolve(PageEffects.navigatePageBack(this._pageId)),
      enabled: this._data.canPageGoBack,
    }));

    menu.append(new MenuItem({
      label: 'Forward',
      click: () => choice.resolve(PageEffects.navigatePageForward(this._pageId)),
      enabled: this._data.canPageGoForward,
    }));

    menu.append(new MenuItem({
      label: 'Reload',
      click: () => choice.resolve(PageEffects.navigatePageRefresh(this._pageId)),
      enabled: this._data.canPageRefresh,
    }));

    menu.append(new MenuItem({ type: 'separator' }));

    if (this._data.event.href) {
      menu.append(new MenuItem({
        label: 'Open Link in New Tab',
        click: () => choice.resolve(PageEffects.createPageSession({
          location: this._data.event.href,
        })),
      }));

      menu.append(new MenuItem({
        label: 'Copy Link Address',
        click: () => choice.resolve(ClipboardEffects.copyTextToClipboard(this._data.event.href)),
      }));
    }

    if (this._data.event.img) {
      menu.append(new MenuItem({
        label: 'Copy Image URL',
        click: () => choice.resolve(ClipboardEffects.copyTextToClipboard(this._data.event.img)),
      }));

      menu.append(new MenuItem({
        label: 'Save Image As...',
        click: () => choice.resolve(PageEffects.performPageDownload(this._data.event.img)),
      }));

      menu.append(new MenuItem({
        label: 'Open Image in New Tab',
        click: () => choice.resolve(PageEffects.createPageSession({
          location: this._data.event.img,
        })),
      }));
    }

    if (this._data.event.img || this._data.event.href) {
      menu.append(new MenuItem({ type: 'separator' }));
    }

    menu.append(new MenuItem({
      label: 'Inspect Element',
      click: () => choice.resolve(PageEffects.performDevtoolsInspectElement(this._pageId, {
        x: this._data.event.x,
        y: this._data.event.y,
      })),
    }));

    menu.popup(win);
    return choice.promise;
  }
}
