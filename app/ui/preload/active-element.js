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

document.addEventListener('blur', () => {
  ipc.sendToHost('focus-data', null);
}, true);

document.addEventListener('focus', () => {
  const target = document.activeElement;
  // We shouldn't send the element itself, only some data about it, since
  // app state is intended to be immutable and easily serializable.
  // Furthermore, we can't send the dom node itself via ipc anyway.
  if (target) {
    ipc.sendToHost('focus-data', { nodeName: target.nodeName });
  } else {
    ipc.sendToHost('focus-data', null);
  }
}, true);
