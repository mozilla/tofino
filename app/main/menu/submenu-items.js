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

const app = electron.app;
const APP_NAME = app.getName();
const HELP_LINK = 'https://github.com/mozilla/tofino';

/**
 * A series of template objects used in Electron's menu creation, or
 * a function that takes in data and returns a template object.
 *
 * @see https://electron.atom.io/docs/latest/api/menu/
 */

const items = Object.create(null);

function openNewWindow() {
  // This setImmediate avoids an interaction between the main process and child
  // rendering process event loops that results in the window only being shown after IO
  // events have happened, which can be quite delayed.
  setImmediate(() => {
    electron.ipcMain.emit('new-browser-window');
  });
}

items.separator = {
  type: 'separator',
};

items.newTab = {
  label: 'New Tab',
  accelerator: 'CmdOrCtrl+T',
  click: (item, focusedWindow) => {
    if (focusedWindow) {
      focusedWindow.webContents.send('new-tab');
    } else {
      openNewWindow();
    }
  },
};

items.newWindow = {
  label: 'New Window',
  accelerator: 'CmdOrCtrl+N',
  click: openNewWindow,
};

items.capturePage = {
  label: 'Fetch page contents',
  click: (item, focusedWindow) => focusedWindow.webContents.send('capture-page'),
};

items.undo = {
  label: 'Undo',
  accelerator: 'CmdOrCtrl+Z',
  role: 'undo',
};

items.redo = {
  label: 'Redo',
  accelerator: 'Shift+CmdOrCtrl+Z',
  role: 'redo',
};

items.cut = {
  label: 'Cut',
  accelerator: 'CmdOrCtrl+X',
  role: 'cut',
};

items.copy = {
  label: 'Copy',
  accelerator: 'CmdOrCtrl+C',
  role: 'copy',
};

items.paste = {
  label: 'Paste',
  accelerator: 'CmdOrCtrl+V',
  role: 'paste',
};

items.selectAll = {
  label: 'Select All',
  accelerator: 'CmdOrCtrl+A',
  role: 'selectall',
};

items.toggleFullScreen = {
  label: 'Toggle Full Screen',
  accelerator: (process.platform === 'darwin') ? 'Ctrl+Command+F' : 'F11',
  click(item, focusedWindow) {
    if (focusedWindow) {
      focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
    }
  },
};

items.showHistory = {
  label: 'Show All History',
  click(item, focusedWindow) {
    if (focusedWindow) {
      focusedWindow.webContents.send('show-history');
    }
  },
};

items.showBookmarks = {
  label: 'Show Starred Pages',
  click(item, focusedWindow) {
    if (focusedWindow) {
      focusedWindow.webContents.send('show-stars');
    }
  },
};

items.openBookmark = bookmark => ({
  label: bookmark.title || bookmark.location,
  click(item, focusedWindow) {
    if (focusedWindow) {
      focusedWindow.webContents.send('open-bookmark', bookmark);
    }
  },
});

items.reloadApp = {
  label: 'Reload App',
  accelerator: 'CmdOrCtrl+Alt+R',
  click(item, focusedWindow) {
    if (focusedWindow) {
      focusedWindow.webContents.send('reload-window');
      focusedWindow.webContents.once('did-finish-load', () => {
        focusedWindow.webContents.send('new-tab');
      });
    }
  },
};

items.toggleBrowserToolbox = {
  label: 'Toggle Browser Toolbox',
  accelerator: 'Alt+CmdOrCtrl+Shift+I',
  click(item, focusedWindow) {
    if (focusedWindow) {
      if (focusedWindow.isDevToolsOpened()) {
        focusedWindow.closeDevTools();
      } else {
        focusedWindow.openDevTools({ detach: true });
      }
    }
  },
};

items.toggleDevTools = {
  label: 'Toggle Developer Tools',
  accelerator: (process.platform === 'darwin') ? 'Alt+Command+I' : 'Ctrl+Shift+I',
  click(item, focusedWindow) {
    if (focusedWindow) {
      focusedWindow.webContents.send('toggle-devtools');
    }
  },
};

items.minimizeWindow = {
  label: 'Minimize',
  accelerator: 'CmdOrCtrl+M',
  role: 'minimize',
};

items.closeTab = {
  label: 'Close Tab',
  accelerator: 'CmdOrCtrl+W',
  click(item, focusedWindow) {
    if (focusedWindow) {
      focusedWindow.webContents.send('close-tab');
    }
  },
};

items.bringAllToFront = {
  label: 'Bring All to Front',
  role: 'front',
};

items.learnMore = {
  label: 'Learn More',
  click() {
    electron.shell.openExternal(HELP_LINK);
  },
};

items.credits = {
  label: 'Credits',
  click(item, focusedWindow) {
    if (focusedWindow) {
      focusedWindow.webContents.send('show-credits');
    }
  },
};

items.osx = Object.create(null);
items.osx.about = {
  label: `About ${APP_NAME}`,
  role: 'about',
};

items.osx.services = {
  label: 'Services',
  role: 'services',
  submenu: [],
};

items.osx.hide = {
  label: `Hide ${APP_NAME}`,
  accelerator: 'Command+H',
  role: 'hide',
};

items.osx.hideOthers = {
  label: 'Hide Others',
  accelerator: 'Command+Alt+H',
  role: 'hideothers',
};

items.osx.showAll = {
  label: 'Show All',
  role: 'unhide',
};

items.osx.quit = {
  label: 'Quit',
  accelerator: 'Command+Q',
  click: () => app.quit(),
};

export default items;
