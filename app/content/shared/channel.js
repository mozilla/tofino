
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
