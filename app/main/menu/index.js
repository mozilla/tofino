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
 * Store the most recently used template so we know what hotkey accelerators
 * are currently active.
 */
let currentMenu = null;

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


  const menu = currentMenu = electron.Menu.buildFromTemplate(menuTemplate);
  electron.Menu.setApplicationMenu(menu);
}

/**
 * To be used in responding to IPC 'synthesize-accelerator' messages, by triggering
 * the click handler if the accelerator matches a currently active menu item.
 *
 * Does not analyze the accelerator for the 'true' command used, for example,
 * it just crudly maps "CmdOrCtrl+T" to "CmdOrCtrl+T" -- it would not match
 * "CommandOrControl+T" or "Command+T" on OSX, etc. This is fine as we're just using
 * these in tests.
 *
 * @see `./app/main/hotkeys.js` as well for handling synthesized browser
 * window hotkeys.
 *
 * Currently should only be used in tests.
 */
export function handleIPCAcceleratorCommand(e, accelerator) {
  if (!currentMenu) {
    return;
  }

  const focusedWindow = electron.BrowserWindow.getFocusedWindow();

  // Recursively iterate and descend over the current menu items to find
  // items that match the passed in accelerator. If a match is found,
  // the `click` handler is executed.
  currentMenu.items.forEach(function findMatchingAccelerator(item) {
    if (item.accelerator === accelerator) {
      // We have to pass in the window as the first argument, and item as second,
      // because in the handler it's in the opposite order. Not sure how or why
      // these arguments get flipped in menu creation.
      item.click(focusedWindow, item);
    }

    if (item.submenu && item.submenu.items) {
      item.submenu.items.forEach(findMatchingAccelerator);
    }
  });
}
