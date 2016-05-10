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

/* eslint no-console: 0 */

import * as actions from './main-actions';
import { getCurrentWebView } from '../browser-util';
import { remote, clipboard, ipcRenderer } from '../../../shared/electron';
import * as userAgent from '../user-agent';

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
export function menuBrowser(pageSessionId, dispatch) {
  const menu = new Menu();

  menu.append(new MenuItem({
    label: 'New Tab',
    click: () => dispatch(actions.createTab()),
  }));

  menu.append(new MenuItem({
    label: 'New Window',
    click: () => newBrowserWindow(),
  }));

  menu.append(new MenuItem({
    label: 'Fetch page contents',
    click: () => {
      const webview = getCurrentWebView(document);
      const startTime = Date.now();
      console.log(`Fetching page contents at ${startTime}`);
      const script = 'window._readerify(window.document)';
      webview.executeJavaScript(script, false, readerResult => {
        console.log(`Got reader result: ${readerResult}.`);
        if (!readerResult) {
          return;
        }
        const endTime = Date.now();
        const duration = endTime - startTime;
        console.log(`In flight at ${endTime} (took ${duration}), location ${readerResult.uri}.`);

        userAgent.api(`/pages/${encodeURIComponent(readerResult.uri)}`, {
          method: 'POST',
          json: { session: pageSessionId, page: readerResult },
        })
          .then() // Fire and forget!
          .catch(); // In the future, we could retry.
      });
    },
  }));

  menu.popup(remote.getCurrentWindow());
}

/**
 * Right click on the location bar
 */
export function menuLocationContext(input, pageId, dispatch) {
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
      dispatch(actions.setUserTypedLocation(pageId, {
        text: loc,
      }));
    },
  }));

  menu.append(new MenuItem({
    label: 'Paste',
    click: () => {
      const before = input.value.slice(0, input.selectionStart);
      const after = input.value.slice(input.selectionEnd);
      dispatch(actions.setUserTypedLocation(pageId, {
        text: `${before}${clipboard.readText()}${after}`,
      }));
    },
  }));

  menu.append(new MenuItem({
    label: 'Paste and Go',
    click: () => {
      const before = input.value.slice(0, input.selectionStart);
      const after = input.value.slice(input.selectionEnd);
      const loc = before + clipboard.readText() + after;
      dispatch(actions.setUserTypedLocation(pageId, {
        text: loc,
      }));

      // TODO this doesn't work anyway, we have to pass in webViewController
      // dispatch(actions.navigatePageTo(-1, fixURL(loc)));
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
    click: actions.createTab,
  }));

  menu.append(new MenuItem({ type: 'separator' }));

  menu.append(new MenuItem({
    label: 'Close Tab',
    click: () => dispatch(actions.closeTab(pageIndex)),
  }));

  menu.popup(remote.getCurrentWindow());
}

/**
 * Right click on the page itself
 */
export function menuWebViewContext(webview, e, dispatch, pageSessionId: number) {
  const menu = new Menu();

  if (e.href) {
    menu.append(new MenuItem({
      label: 'Open Link in New Tab',
      click: () => dispatch(actions.createTab(e.href, pageSessionId)),
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
      click: () => dispatch(actions.createTab(e.img, pageSessionId)),
    }));
  }

  if (e.hasSelection) {
    menu.append(new MenuItem({
      label: 'Copy',
      click: () => webview.copy(),
    }));
  }

  menu.append(new MenuItem({
    label: 'Select All',
    click: () => webview.selectAll(),
  }));

  menu.append(new MenuItem({ type: 'separator' }));

  menu.append(new MenuItem({
    label: 'Inspect Element',
    click: () => webview.inspectElement(e.x, e.y),
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
