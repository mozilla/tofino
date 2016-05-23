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

import path from 'path';
import EventEmitter from 'events';
import WebSocket from 'ws';
import request from 'request';
import { setTimeout } from 'timers';
import childProcess from 'child_process';
import * as endpoints from './constants/endpoints';

function uaRequest(service, options) {
  return new Promise((resolve, reject) => {
    request[options.method.toLowerCase()]({
      url: `${endpoints.UA_SERVICE_HTTP}${service}`,
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

class UserAgent extends EventEmitter {
  constructor(ws, clientCount) {
    super();

    this.ws = ws;
    this.clientCount = clientCount;

    this.ws.on('message', (data) => {
      data = JSON.parse(data);
      const message = data.message;
      delete data.message;
      this.emit(message, data);
    });
  }

  startSession() {
    return uaRequest('/session/start', {
      method: 'POST',
    });
  }
}

const timeout = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function startService() {
  // Start a UA service
  const exec = 'node';
  const args = ['server.js'];

  console.log('Starting UA process');
  childProcess.spawn(exec, args, {
    detached: true,
    cwd: path.join(__dirname, '..', 'main'),
  });
}

function attemptConnect() {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(`${endpoints.UA_SERVICE_WS}`);

    ws.on('open', () => {
      console.log('Connected to UA process');

      // The first message should be protocol information
      ws.once('message', (data) => {
        data = JSON.parse(data);

        if (data.message !== 'protocol' || data.version !== 'v1') {
          console.error(`Incorrect message ${JSON.stringify(data)}`);
          reject();
          return;
        }
        resolve(new UserAgent(ws, data.clientCount));
      });
    });

    ws.on('error', (e) => {
      reject(e);
    });
  });
}

async function backoffConnect() {
  let timedout = false;
  const timer = setTimeout(() => timedout = true, 5000);
  let delay = 200;

  while (!timedout) {
    try {
      const ua = await attemptConnect();
      clearTimeout(timer);
      return ua;
    } catch (e) {
      await timeout(delay);
      delay *= 2;
    }
  }

  throw new Error('Unable to connect to the UA service.');
}

export default {
  async connect() {
    console.log('Attempting to connect');
    try {
      return await attemptConnect();
    } catch (e) {
      if (e.code === 'ECONNREFUSED') {
        startService();
        return await backoffConnect();
      }
      throw e;
    }
  },
};
