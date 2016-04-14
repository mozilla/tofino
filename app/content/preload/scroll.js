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
const throttle = require('lodash.throttle');
// How often the scroll handler may be fired at most
const THROTTLE_TIMER = 1000;

window.addEventListener('scroll', throttle(e => {
  ipc.sendToHost('scroll', window.scrollY);
}, THROTTLE_TIMER, { trailing: true });
