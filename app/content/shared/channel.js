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

function Channel(target) {
  this._events = new Map();
  this._target = target;

  window.addEventListener('message', this._receive.bind(this), false);
}

Channel.prototype = {
  send(type, data) {
    const message = {
      target: this._target,
      source: 'page',
      type,
      data,
    };

    window.postMessage(JSON.stringify(message), '*');
  },

  _receive(event) {
    const message = JSON.parse(event.data);
    if (message.target !== 'page' || message.source !== this._target) {
      return;
    }

    const listeners = this._events.get(message.type);
    if (listeners) {
      for (const listener of listeners) {
        listener(this, message.type, message.data);
      }
    }
  },

  on(type, listener) {
    let set = this._events.get(type);
    if (!set) {
      set = new Set();
      this._events.set(type, set);
    }
    set.add(listener);
  },

  once(type, listener) {
    const interListener = (channel, itype, data) => {
      this.off(itype, interListener);
      listener(channel, itype, data);
    };

    this.on(type, listener);
  },

  off(type, listener) {
    this._events.get(type).delete(listener);
  },
};

export default new Channel('host');
