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

import queue from 'queue';

export default class Queue {
  constructor(options) {
    this._q = queue(options);
  }

  push(fn) {
    this._q.push(fn);

    // Always start draining the queue if previously empty. This is an
    // oddity with the underlying queue implementation itself: when empty,
    // need to manually restart after pushing.
    this._q.start();
  }
}
