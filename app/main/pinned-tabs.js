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

import { ipcMain, webContents } from 'electron';
import url from 'url';

function handleWillNavigate(wc, renderer, event, newUrl) {
  const currentUrl = url.parse(wc.getURL());

  if (url.parse(newUrl).host !== currentUrl.host) {
    event.preventDefault();
    renderer.send('new-tab', newUrl);
  }
}

const handlerMap = new WeakMap();

ipcMain.on('guest-pinned-state', (event, id, pinned) => {
  const wc = webContents.fromId(id);
  if (pinned) {
    const handler = handleWillNavigate.bind(null, wc, event.sender);

    wc.on('will-navigate', handler);
    handlerMap.set(wc, handler);
  } else {
    const handler = handlerMap.get(wc);
    if (handler) {
      wc.removeListener('will-navigate', handler);
    }
  }
});
