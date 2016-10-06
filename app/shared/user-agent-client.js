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
import backoff from 'backoff';
import { logger } from './logging';
import { UserAgentHttpClient } from './user-agent-http-client';

class UserAgentClient extends EventEmitter {
  // You'd think { initialConnectDelayMillis = 50, maxConnectDelayMillis = 10000 } would work.  In
  // fact, you'd be crying in your beer, just like me: it doesn't when you call simply `new
  // UserAgentClient()`.
  constructor(options) {
    super();
    this._connected = false;
    this.userAgentHttpClient = null;
    this.initialConnectDelayMillis = (options && options.initialConnectDelayMillis) || 50;
    this.maxConnectDelayMillis = (options && options.maxConnectDelayMillis) || 10000;
  }

  connectionDetails() {
    return {
      version: this.userAgentHttpClient.version,
      host: this.userAgentHttpClient.host,
      port: this.userAgentHttpClient.port,
    };
  }

  async startSession() {
    // Do not use `this._connect` promise in the event we call a subsequent
    // `connect()` with different port/host/version information during negotiating
    // the port, for example.
    if (!this._connected) {
      await new Promise(resolve => this.once('connected', resolve));
    }

    return this.userAgentHttpClient.createSession(null, { scope: 0 });
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
        this.userAgentHttpClient &&
        this.userAgentHttpClient.version === version &&
        this.userAgentHttpClient.host === host &&
        this.userAgentHttpClient.port === port) {
      return this._connect;
    }

    this._connected = false;
    this.userAgentHttpClient = new UserAgentHttpClient({ version, host, port });

    this._connect = new Promise(resolve => {
      const call = backoff.call(this._connectAttempt, this.userAgentHttpClient.wsUrl, (err, ws) => {
        if (err) {
          logger.error(`UserAgentClient: ${err}`);
        } else if (ws) {
          this.ws = ws;
          this._connected = true;
          resolve(this);
        }
      });
      call.setStrategy(new backoff.ExponentialStrategy({
        initialDelay: this.initialConnectDelayMillis,
        maxDelay: this.maxConnectDelayMillis,
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
