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

import {
  createTab, setUserTypedLocation, duplicateTab, closeTab, navigatePageTo,
} from './main-actions';
import { getCurrentWebView, fixURL } from '../browser-util';
import { remote, clipboard, ipcRenderer } from 'electron';

const { Menu, MenuItem } = remote;

/*

This file contains actions with side-effects.

If you're looking to follow this through from a Redux POV, start with
'main-actions.js'.

Redux likes to keep its actions pure, but the real world of housing webviews is
that side-effects are common. So external state such as the clipboard and
window position are managed here. The pure state changes in Redux actions are
also fired from here.

Until bookmarks can be held in global state, then they're also considered to be
external actions.

*/

/**
 * Open the browser (hamburger) menu
 */
export function menuBrowser(dispatch) {
  const menu = new Menu();

  menu.append(new MenuItem({
    label: 'New Tab',
    click: () => dispatch(createTab()),
  }));

  menu.append(new MenuItem({
    label: 'New Window',
    click: () => ipcRenderer.send('new-window'),
  }));

  menu.popup(remote.getCurrentWindow());
}

/**
 * Right click on the location bar
 */
export function menuLocationContext(input, dispatch) {
  const menu = new Menu();

  menu.append(new MenuItem({
    label: 'Copy',
    click: () => clipboard.writeText(input.value),
  }));

  menu.append(new MenuItem({
    label: 'Cut',
    click: () => {
      const value = input.value;
      clipboard.writeText(value.slice(input.selectionStart, input.selectionEnd));
      const loc = value.slice(0, input.selectionStart) + value.slice(input.selectionEnd);
      dispatch(setUserTypedLocation({
        pageIndex: -1,
        userTyped: loc,
      }));
    },
  }));

  menu.append(new MenuItem({
    label: 'Paste',
    click: () => {
      const before = input.value.slice(0, input.selectionStart);
      const after = input.value.slice(input.selectionEnd);
      dispatch(setUserTypedLocation({
        pageIndex: -1,
        userTyped: `${before}${clipboard.readText()}${after}`,
      }));
    },
  }));

  menu.append(new MenuItem({
    label: 'Paste and Go',
    click: () => {
      const before = input.value.slice(0, input.selectionStart);
      const after = input.value.slice(input.selectionEnd);
      const loc = before + clipboard.readText() + after;
      dispatch(setUserTypedLocation({
        pageIndex: -1,
        userTyped: loc,
      }));
      dispatch(navigatePageTo(-1, fixURL(loc)));
    },
  }));

  menu.popup(remote.getCurrentWindow());
}

/**
 * Right click on a tab
 */
export function menuTabContext(pageIndex, dispatch) {
  const menu = new Menu();

  menu.append(new MenuItem({
    label: 'New Tab',
    click: createTab,
  }));

  menu.append(new MenuItem({
    label: 'Duplicate',
    click: () => dispatch(duplicateTab()),
  }));

  menu.append(new MenuItem({ type: 'separator' }));

  menu.append(new MenuItem({
    label: 'Close Tab',
    click: () => dispatch(closeTab(pageIndex)),
  }));

  menu.popup(remote.getCurrentWindow());
}

/**
 * Right click on the page itself
 */
export function menuWebViewContext(e, dispatch) {
  const menu = new Menu();

  if (e.href) {
    menu.append(new MenuItem({
      label: 'Open Link in New Tab',
      click: () => dispatch(createTab(e.href)),
    }));

    menu.append(new MenuItem({
      label: 'Copy Link Address',
      click: () => clipboard.writeText(e.href),
    }));
  }

  if (e.img) {
    menu.append(new MenuItem({
      label: 'Save Image As...',
      click: () => {},
    }));

    menu.append(new MenuItem({
      label: 'Copy Image URL',
      click: () => clipboard.writeText(e.img),
    }));

    menu.append(new MenuItem({
      label: 'Open Image in New Tab',
      click: () => dispatch(createTab(e.img)),
    }));
  }

  if (e.hasSelection) {
    menu.append(new MenuItem({
      label: 'Copy',
      click: ev => getCurrentWebView(ev.target.ownerDocument).copy(),
    }));
  }

  menu.append(new MenuItem({
    label: 'Select All',
    click: ev => getCurrentWebView(ev.target.ownerDocument).selectAll(),
  }));

  menu.append(new MenuItem({ type: 'separator' }));

  menu.append(new MenuItem({
    label: 'Inspect Element',
    click: ev => getCurrentWebView(ev.target.ownerDocument).inspectElement(e.x, e.y),
  }));

  menu.popup(remote.getCurrentWindow());
}

/**
 * Right click somewhere in a web page
 */
export function contextMenu(e) {
  const { offsetX: x, offsetY: y } = e.nativeEvent;
  e.target.send('get-contextmenu-data', { x, y });
}

/**
 * 'Zoom' on OSX
 */
export function maximize() {
  if (remote.getCurrentWindow()) {
    remote.getCurrentWindow().maximize();
  } else {
    remote.unmaximize();
  }
}

/**
 * Yellow window button
 */
export function minimize() {
  remote.getCurrentWindow().minimize();
}

/**
 * Close window
 */
export function close() {
  remote.getCurrentWindow().close();
}

/**
 * Perform the search if the user just pressed return
 */
export function inPageSearch(ev) {
  if (ev.keyCode === 13) {
    ev.preventDefault();
    const webview = getCurrentWebView(ev.target.ownerDocument);
    const script = `window.find('${ev.target.value}', 0, 0, 1)`;
    webview.executeJavaScript(script);
  }
}
