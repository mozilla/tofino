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
 * A series of template objects used in Electron's menu creation, or
 * a function that takes in data and returns a template object.
 *
 * @see https://electron.atom.io/docs/latest/api/menu/
 */

import electron from 'electron';
import items from './submenu-items';

const APP_NAME = electron.app.getName();

const menus = {
  file: {
    label: 'File',
    submenu: [
      items.newTab,
      items.newWindow,
      items.capturePage,
    ],
  },
  edit: {
    label: 'Edit',
    submenu: [
      items.undo,
      items.redo,
      items.separator,
      items.cut,
      items.copy,
      items.paste,
      items.selectAll,
    ],
  },
  view: {
    label: 'View',
    submenu: [
      items.toggleFullScreen,
    ],
  },
  history: {
    label: 'History',
    submenu: [
      items.showHistory,
      items.separator,
    ],
  },
  bookmarks: (data) => {
    const bookmarksMenu = {
      label: 'Bookmarks',
      submenu: [
        items.showBookmarks,
        items.separator,
      ],
    };

    if (data.recentBookmarks) {
      data.recentBookmarks.reduce((submenu, bookmark) => {
        submenu.push(items.openBookmark(bookmark));
        return submenu;
      }, bookmarksMenu.submenu);
    }

    return bookmarksMenu;
  },
  tools: {
    label: 'Tools',
    submenu: [
      items.reloadApp,
      items.toggleBrowserToolbox,
      items.toggleDevTools,
    ],
  },
  window: {
    label: 'Window',
    role: 'window',
    submenu: [
      items.minimizeWindow,
      items.closeTab,
      items.separator,
      items.bringAllToFront,
    ],
  },
  help: {
    label: 'Help',
    role: 'help',
    submenu: [
      items.learnMore,
      items.credits,
    ],
  },
  osx: {
    label: APP_NAME,
    submenu: [
      items.osx.about,
      items.separator,
      items.osx.services,
      items.separator,
      items.osx.hide,
      items.osx.hideOthers,
      items.osx.showAll,
      items.separator,
      items.osx.quit,
    ],
  },
};

export default menus;
