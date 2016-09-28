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
import { MinimalAppMenuTemplate, AppMenuTemplate, WindowMenuTemplate } from './template';
import menus from './menus';

/**
 * Store the most recently used template so we know what hotkey accelerators
 * are currently active.
 */
let currentMenu = null;

function buildTemplate(items, data) {
  const buildItem = itemTemplate => {
    if (typeof itemTemplate === 'function') {
      itemTemplate = itemTemplate(data);
    }

    if ('submenu' in itemTemplate) {
      // Filter out falsy submenu entities, for instance where they're undefined
      // due to environment settings
      itemTemplate.submenu = itemTemplate.submenu.filter(x => x).map(buildItem);
    }

    return itemTemplate;
  };

  return items.map(buildItem);
}

function buildMenu(items, data) {
  const template = buildTemplate(items, data);
  return currentMenu = electron.Menu.buildFromTemplate(template);
}

/**
 * A function that takes data and generates electron OS menus based on that data.
 * Most of the menus are based off of templates, but can take the following options:
 *
 * @param {Array<Object>} data.recentBookmarks
 *        An array of bookmark objects to populate the recent bookmarks
 *        in the bookmarks menu.
 */
export function buildAppMenu(data = {}) {
  let template = AppMenuTemplate;

  if (process.os === 'darwin') {
    if (electron.BrowserWindow.getAllWindows().length === 0) {
      template = MinimalAppMenuTemplate;
    }

    template = template.slice(0);
    template.unshift(menus.osx);
  }

  electron.Menu.setApplicationMenu(buildMenu(template, data));
}

export function buildWindowMenu(data = {}) {
  return buildMenu(WindowMenuTemplate, data);
}

/**
 * To be used in responding to IPC 'synthesize-accelerator' messages, by triggering
 * the click handler if the accelerator matches a currently active menu item.
 *
 * Does not analyze the accelerator for the 'true' command used, for example,
 * it just crudely maps "CmdOrCtrl+T" to "CmdOrCtrl+T" -- it would not match
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
