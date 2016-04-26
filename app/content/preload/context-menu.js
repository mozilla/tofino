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

import { ipcRenderer as ipc } from 'electron';

function triggerMenu(data) {
  ipc.sendToHost('contextmenu-data', data);
}

ipc.on('get-contextmenu-data', (event, pos) => {
  const data = {
    x: pos.x,
    y: pos.y,
    hasSelection: !!window.getSelection().toString(),
    href: false,
    img: false,
    video: false,
  };

  let el = document.elementFromPoint(pos.x, pos.y);
  while (el && el.tagName) {
    if (!data.img && el.tagName === 'IMG') {
      data.img = el.src;
    }
    if (!data.href && el.href) {
      data.href = el.href;
    }
    el = el.parentNode;
  }

  triggerMenu(data);
});
