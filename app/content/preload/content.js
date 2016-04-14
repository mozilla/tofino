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

const ipc = require('electron').ipcRenderer;
require('./hover-status');
require('./context-menu');
require('./scroll');

window.addEventListener('message', (event) => {
  if (event.origin !== 'atom://') {
    return;
  }

  const data = JSON.parse(event.data);
  if (data.source !== 'page') {
    return;
  }

  if (data.target === 'host') {
    ipc.sendToHost('channel-message', data.source, data.type, data.data);
  } else if (data.target === 'main') {
    ipc.send('channel-message', data.source, data.type, data.data);
  }
}, false);

ipc.on('channel-message', (event, source, type, data) => {
  const message = {
    target: 'page',
    source,
    type,
    data,
  };
  window.postMessage(JSON.stringify(message), 'atom://');
});
