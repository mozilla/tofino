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
import * as endpoints from './constants/endpoints';

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
  constructor(url = endpoints.UA_SERVICE_WS) {
    super();
    this.url = url;
  }

  startSession(url = endpoints.UA_SERVICE_HTTP) {
    return uaRequest(url, '/session/start', {
      method: 'POST',
    });
  }

  /**
   * Connects to the remote User Agent Service, and resolves a promise
   * upon completion. Can be called multiple times and caches the connection
   * promise so consumers can always call `await client.connect()` safely.
   *
   * @TODO what happens if this never connects?
   */
  async connect() {
    if (this._connect) {
      return this._connect;
    }

    this._connect = new Promise((resolve) => {
      const call = backoff.call(this._connectAttempt, this.url, (err, ws) => {
        if (err) {
          console.error(`UserAgentClient: ${err}`);
        } else if (ws) {
          this.ws = ws;
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

    this.ws.on('message', (data) => {
      data = JSON.parse(data);
      const message = data.message;
      delete data.message;
      this.emit(message, data);
    });

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
        ws.once('message', (data) => {
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
