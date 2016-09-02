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

import * as actions from './main-actions';
import { getCurrentWebView } from '../browser-util';
import { remote, clipboard, ipcRenderer } from '../../../shared/electron';

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
export function menuBrowser() {
  ipcRenderer.send('open-menu');
}

/**
 * Right click on the location bar
 */
export const locationContextFunctions = {
  copy(input) {
    clipboard.writeText(input.value);
  },
  cut(input, pageId, dispatch) {
    const value = input.value;
    clipboard.writeText(value.slice(input.selectionStart, input.selectionEnd));
    const loc = value.slice(0, input.selectionStart) + value.slice(input.selectionEnd);
    dispatch(actions.setUserTypedLocation(pageId, {
      text: loc,
    }));
  },
  paste(input, pageId, dispatch) {
    const before = input.value.slice(0, input.selectionStart);
    const after = input.value.slice(input.selectionEnd);
    dispatch(actions.setUserTypedLocation(pageId, {
      text: `${before}${clipboard.readText()}${after}`,
    }));
  },
  pasteAndGo(input, pageId, dispatch) {
    const before = input.value.slice(0, input.selectionStart);
    const after = input.value.slice(input.selectionEnd);
    const loc = before + clipboard.readText() + after;
    dispatch(actions.setUserTypedLocation(pageId, {
      text: loc,
    }));

    // TODO this doesn't work anyway, we have to pass in webViewController
    // dispatch(actions.navigatePageTo(-1, fixURL(loc)));
  },
};

export function menuLocationContext(input, pageId, dispatch) {
  const menu = new Menu();

  menu.append(new MenuItem({
    label: 'Copy',
    click: () => locationContextFunctions.copy(input),
  }));

  menu.append(new MenuItem({
    label: 'Cut',
    click: () => locationContextFunctions.cut(input, pageId, dispatch),
  }));

  menu.append(new MenuItem({
    label: 'Paste',
    click: () => locationContextFunctions.paste(input, pageId, dispatch),
  }));

  menu.append(new MenuItem({
    label: 'Paste and Go',
    click: () => locationContextFunctions.pasteAndGo(input, pageId, dispatch),
  }));

  menu.popup(remote.getCurrentWindow());
}

/**
 * Right click on a tab
 */
export const tabContextFunctions = {
  newTab(dispatch) {
    dispatch(actions.createTab());
  },
  closeTab(pageId, dispatch) {
    dispatch(actions.closeTab(pageId));
  },
};

export function menuTabContext(pageId, dispatch) {
  const menu = new Menu();

  menu.append(new MenuItem({
    label: 'New Tab',
    click: tabContextFunctions.newTab,
  }));

  menu.append(new MenuItem({ type: 'separator' }));

  menu.append(new MenuItem({
    label: 'Close Tab',
    click: () => tabContextFunctions.closeTab(pageId, dispatch),
  }));

  menu.popup(remote.getCurrentWindow());
}

/**
 * Right click on the page itself
 */
export const webViewContextFunctions = {
  openLinkInNewTab(e, dispatch, pageSessionId) {
    dispatch(actions.createTab(e.href, pageSessionId));
  },
  copyLinkAddress(e) {
    clipboard.writeText(e.href);
  },
  saveImageAs() {},
  copyImageURL(e) {
    clipboard.writeText(e.img);
  },
  openImageInNewTab(e, dispatch, pageSessionId) {
    dispatch(actions.createTab(e.img, pageSessionId));
  },
  copy(webview) {
    webview.copy();
  },
  selectAll(webview) {
    webview.selectAll();
  },
  inspectElement(webview, e) {
    webview.inspectElement(e.x, e.y);
  },
};

export function menuWebViewContext(webview, e, dispatch, pageSessionId) {
  const menu = new Menu();

  if (e.href) {
    menu.append(new MenuItem({
      label: 'Open Link in New Tab',
      click: () => webViewContextFunctions.openLinkInNewTab(e, dispatch, pageSessionId),
    }));

    menu.append(new MenuItem({
      label: 'Copy Link Address',
      click: () => webViewContextFunctions.copyLinkAddress(e),
    }));
  }

  if (e.img) {
    menu.append(new MenuItem({
      label: 'Save Image As...',
      click: () => webViewContextFunctions.saveImageAs(e),
    }));

    menu.append(new MenuItem({
      label: 'Copy Image URL',
      click: () => webViewContextFunctions.copyImageURL(e),
    }));

    menu.append(new MenuItem({
      label: 'Open Image in New Tab',
      click: () => webViewContextFunctions.openImageInNewTab(e, dispatch, pageSessionId),
    }));
  }

  if (e.hasSelection) {
    menu.append(new MenuItem({
      label: 'Copy',
      click: () => webViewContextFunctions.copy(webview),
    }));
  }

  menu.append(new MenuItem({
    label: 'Select All',
    click: () => webViewContextFunctions.selectAll(webview),
  }));

  menu.append(new MenuItem({ type: 'separator' }));

  menu.append(new MenuItem({
    label: 'Inspect Element',
    click: () => webViewContextFunctions.inspectElement(webview, e),
  }));

  menu.popup(remote.getCurrentWindow());
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
 * Close window.
 */
export function close() {
  ipcRenderer.send('close-browser-window');
}

/**
 * Open New Window.
 */
export function newBrowserWindow() {
  ipcRenderer.send('new-browser-window');
}

/**
 * Perform the search if the user just pressed return
 */
export function inPageSearch(ev) {
  if (ev.key === 'Enter') {
    ev.preventDefault();
    const webview = getCurrentWebView(ev.target.ownerDocument);
    const script = `window.find('${ev.target.value}', 0, 0, 1)`;
    webview.executeJavaScript(script);
  }
}
