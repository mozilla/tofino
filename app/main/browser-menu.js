
const electron = require('electron');
const Menu = electron.Menu;

const BrowserMenu = {
  file: {
    label: 'File',
    submenu: [
      {
        label: 'New Tab',
        accelerator: 'CmdOrCtrl+T',
        click: (item, focusedWindow) => {
          if (focusedWindow) {
            focusedWindow.webContents.send('new-tab');
          }
        },
      },
      {
        label: 'New Window',
        accelerator: 'CmdOrCtrl+N',
        click: (item, focusedWindow) => {
          if (focusedWindow) {
            focusedWindow.webContents.send('new-window');
          }
        },
      },
    ],
  },
  edit: {
    label: 'Edit',
    submenu: [
      {
        label: 'Undo',
        accelerator: 'CmdOrCtrl+Z',
        role: 'undo',
      },
      {
        label: 'Redo',
        accelerator: 'Shift+CmdOrCtrl+Z',
        role: 'redo',
      },
      {
        type: 'separator',
      },
      {
        label: 'Cut',
        accelerator: 'CmdOrCtrl+X',
        role: 'cut',
      },
      {
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C',
        role: 'copy',
      },
      {
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        role: 'paste',
      },
      {
        label: 'Select All',
        accelerator: 'CmdOrCtrl+A',
        role: 'selectall',
      },
    ],
  },
  view: {
    label: 'View',
    submenu: [
      {
        label: 'Toggle Full Screen',
        accelerator: (process.platform === 'darwin') ? 'Ctrl+Command+F' : 'F11',
        click(item, focusedWindow) {
          if (focusedWindow) {
            focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
          }
        },
      },
    ],
  },
  history: {
    label: 'History',
    submenu: [
      {
        label: 'Show All History',
        click: () => {},
      },
      {
        label: 'Clear History',
        click: () => {},
      },
      {
        type: 'separator',
      },
    ],
  },
  bookmarks: (bookmarks) => {
    const items = {
      label: 'Bookmarks',
      submenu: [
        {
          label: 'Show All Bookmarks',
          click(item, focusedWindow) {
            if (focusedWindow) {
              focusedWindow.webContents.send('show-bookmarks');
            }
          },
        },
        {
          type: 'separator',
        },
      ],
    };

    if (bookmarks) {
      bookmarks.forEach(bookmark => {
        items.submenu.push({
          label: bookmark.title || bookmark.url,
          click(item, focusedWindow) {
            if (focusedWindow) {
              focusedWindow.webContents.send('open-bookmark', bookmark);
            }
          },
        });
      });
    }

    return items;
  },
  tools: {
    label: 'Tools',
    submenu: [
      {
        label: 'Reload App',
        accelerator: 'CmdOrCtrl+R',
        click(item, focusedWindow) {
          if (focusedWindow) {
            focusedWindow.reload();
          }
        },
      },
      {
        label: 'Toggle Developer Tools',
        accelerator: (process.platform === 'darwin') ? 'Alt+Command+I' : 'Ctrl+Shift+I',
        click(item, focusedWindow) {
          if (focusedWindow) {
            if (focusedWindow.isDevToolsOpened()) {
              focusedWindow.closeDevTools();
            } else {
              focusedWindow.openDevTools({ detach: true });
            }
          }
        },
      },
    ],
  },
  window: {
    label: 'Window',
    role: 'window',
    submenu: [
      {
        label: 'Minimize',
        accelerator: 'CmdOrCtrl+M',
        role: 'minimize',
      },
      {
        label: 'Close',
        accelerator: 'CmdOrCtrl+W',
        role: 'close',
      },
      {
        type: 'separator',
      },
      {
        label: 'Bring All to Front',
        role: 'front',
      },
    ],
  },
  help: {
    label: 'Help',
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click() {
          electron.shell.openExternal('https://support.mozilla.org/products/firefox');
        },
      },
    ],
  },

  build(data) {
    data = data || {};
    const template = [];

    if (process.platform === 'darwin') {
      const app = electron.app;
      const name = app.getName();
      template.push({
        label: name,
        submenu: [
          {
            label: 'About ' + name,
            role: 'about',
          },
          {
            type: 'separator',
          },
          {
            label: 'Services',
            role: 'services',
            submenu: [],
          },
          {
            type: 'separator',
          },
          {
            label: 'Hide ' + name,
            accelerator: 'Command+H',
            role: 'hide',
          },
          {
            label: 'Hide Others',
            accelerator: 'Command+Alt+H',
            role: 'hideothers',
          },
          {
            label: 'Show All',
            role: 'unhide',
          },
          {
            type: 'separator',
          },
          {
            label: 'Quit',
            accelerator: 'Command+Q',
            click() { app.quit(); },
          },
        ],
      });
    }

    template.push(this.file);
    template.push(this.edit);
    template.push(this.view);
    template.push(this.history);
    template.push(this.bookmarks(data.bookmarks));
    template.push(this.tools);
    template.push(this.window);
    template.push(this.help);

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  },

  default() {
    const template = [];

    if (process.platform === 'darwin') {
      const app = electron.app;
      const name = app.getName();
      template.push({
        label: name,
        submenu: [
          {
            label: 'About ' + name,
            role: 'about',
          },
          {
            type: 'separator',
          },
          {
            label: 'Services',
            role: 'services',
            submenu: [],
          },
          {
            type: 'separator',
          },
          {
            label: 'Hide ' + name,
            accelerator: 'Command+H',
            role: 'hide',
          },
          {
            label: 'Hide Others',
            accelerator: 'Command+Alt+H',
            role: 'hideothers',
          },
          {
            label: 'Show All',
            role: 'unhide',
          },
          {
            type: 'separator',
          },
          {
            label: 'Quit',
            accelerator: 'Command+Q',
            click: () => app.quit(),
          },
        ],
      });
    }

    template.push(this.edit);
    template.push(this.window);
    template.push(this.help);

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  },
};

export default BrowserMenu;
