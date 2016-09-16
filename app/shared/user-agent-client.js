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

import EventEmitter from 'events';
import WebSocket from 'ws';
import request from 'request';
import backoff from 'backoff';
import { logger } from './logging';

function uaRequest(url, service, options) {
  return new Promise((resolve, reject) => {
    request[options.method.toLowerCase()]({
      url: `${url}${service}`,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }, (err, response, body) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(JSON.parse(body));
    });
  });
}

class UserAgentClient extends EventEmitter {
  constructor() {
    super();
    this._connected = false;
  }

  async startSession() {
    // Do not use `this._connect` promise in the event we call a subsequent
    // `connect()` with different port/host/version information during negotiating
    // the port, for example.
    if (!this._connected) {
      await new Promise(resolve => this.once('connected', resolve));
    }

    const url = `http://${this.host}:${this.port}/${this.version}`;
    return uaRequest(url, '/session/start', {
      method: 'POST',
    });
  }

  /**
   * Connects to the remote User Agent Service, and resolves a promise
   * upon completion. Can be called multiple times and caches the connection
   * promise so consumers can always call `await client.connect(ops)` safely.
   *
   * Calling with different address information will attempt a new connection.
   *
   * @TODO what happens if this never connects?
   */
  async connect({ version, host, port }) {
    if (!version || !host || !port) {
      throw new Error('Must have host, port, and version defined.');
    }

    // If we already connected to this version, host and port,
    // return the same promise.
    if (this._connect &&
        this.version === version &&
        this.host === host &&
        this.port === port) {
      return this._connect;
    }

    this._connected = false;
    this.version = version;
    this.host = host;
    this.port = port;

    const url = `ws://${this.host}:${this.port}/${this.version}/ws`;

    this._connect = new Promise(resolve => {
      const call = backoff.call(this._connectAttempt, url, (err, ws) => {
        if (err) {
          logger.error(`UserAgentClient: ${err}`);
        } else if (ws) {
          this.ws = ws;
          this._connected = true;
          resolve(this);
        }
      });
      call.setStrategy(new backoff.ExponentialStrategy({
        initialDelay: 50,
        maxDelay: 10000,
      }));
      call.start();
    });

    await this._connect;

    this.ws.on('message', data => {
      data = JSON.parse(data);
      const message = data.message;
      delete data.message;
      this.emit(message, data);
    });

    this.emit('connected');

    return this._connect;
  }

  _connectAttempt(url, callback) {
    // Use promises here so we only get one firing over the callback
    // per attempt, but pipe into the callback for compatibility with
    // `backoff` module.
    const attempt = new Promise((resolve, reject) => {
      const ws = new WebSocket(url);
      ws.on('error', reject);
      ws.on('open', () => {
        // The first message should be protocol information
        ws.once('message', data => {
          data = JSON.parse(data);

          if (data.message !== 'protocol' || data.version !== 'v1') {
            reject(new Error(`Incorrect message ${JSON.stringify(data)}`));
            return;
          }
          resolve(ws);
        });
      });
    });

    attempt.then(callback.bind(null, null), callback);
  }
}

export default UserAgentClient;
