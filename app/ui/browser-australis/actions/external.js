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

import { remote, ipcRenderer } from '../../../shared/electron';
import { getCurrentWebView } from '../util';

export function maximizeWindow() {
  if (remote.getCurrentWindow()) {
    remote.getCurrentWindow().maximize();
  } else {
    remote.unmaximize();
  }
}

export function minimizeWindow() {
  remote.getCurrentWindow().minimize();
}

export function closeWindow() {
  ipcRenderer.send('close-browser-window');
}

export function openAppMenu() {
  ipcRenderer.send('open-menu');
}

export function performPageSearch(document, text) {
  const webview = getCurrentWebView(document);
  webview.executeJavaScript('window.getSelection().empty()');
  webview.executeJavaScript(`window.find('${text}', 0, 0, 1)`);
}
