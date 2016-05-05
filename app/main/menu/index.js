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

import electron from 'electron';
import assert from 'assert';
import BrowserMenuTemplate from './template';

const DEFAULT_MENU_ITEMS = [
  'file', 'edit', 'view', 'history', 'bookmarks', 'tools', 'window', 'help',
];

const OSX_MINIMAL_MENU_ITEMS = [
  'file', 'edit', 'window', 'help',
];

/**
 * A function that takes data and generates electron OS menus based on that data.
 * Most of the menus are based off of templates, but can take the following options:
 *
 * @param {Array<Object>} data.recentBookmarks
 *        An array of bookmark objects to populate the recent bookmarks
 *        in the bookmarks menu.
 * @param {Boolean} data.osxMinimal
 *        A flag to indicate whether a minimal menu set should be used. This
 *        should only be used in OSX when all windows have closed.
 */
export function build(data = {}) {
  const menuTemplate = [];
  const isDarwin = process.platform === 'darwin';

  if (isDarwin) {
    menuTemplate.push(BrowserMenuTemplate.osx);
  }

  const menuSet = data.osxMinimal ? OSX_MINIMAL_MENU_ITEMS : DEFAULT_MENU_ITEMS;

  assert(data.osxMinimal ? isDarwin : true, '`osxMinimal` may only be used in OSX.');

  menuSet.reduce((template, menuName) => {
    let itemTemplate = BrowserMenuTemplate[menuName];
    if (typeof itemTemplate === 'function') {
      itemTemplate = itemTemplate(data);
    }
    template.push(itemTemplate);
    return template;
  }, menuTemplate);

  const menu = electron.Menu.buildFromTemplate(menuTemplate);
  electron.Menu.setApplicationMenu(menu);
}
