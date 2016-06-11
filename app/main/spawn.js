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

import { spawn } from 'child_process';
import path from 'path';
import * as endpoints from '../shared/constants/endpoints';
import BUILD_CONFIG from '../../build-config';

const ROOT = path.join(__dirname, '..', '..');
const DB_PATH = ROOT;
const SERVICES_PATH = path.join(ROOT, 'lib', 'services');
const UA_SERVICE_BIN = path.join(SERVICES_PATH, 'user-agent-service', 'bin', 'user-agent-service');
const CONTENT_SERVICE_PATH = path.join(SERVICES_PATH, 'content-service', 'index.js');

// @TODO Use something like `forever` or `pm2` to ensure that this
// process remains running
// @TODO Will `node` be accessible via path on users machines that don't
// have node installed as an engineer?

const children = [];

export function startUserAgentService(userAgentClient, options = {}) {
  const port = endpoints.UA_SERVICE_PORT;
  const host = endpoints.UA_SERVICE_ADDR;
  const version = endpoints.UA_SERVICE_VERSION;

  // Careful passing in options.attached as true, as this stops the service from
  // outliving the its original parent, which we want to allow in the UAS case.
  const detached = !options.attached; // Detach by default
  const stdio = detached ? ['ignore'] : ['ignore', process.stdout, process.stderr];

  children.push(spawn('node', [UA_SERVICE_BIN,
    '--port', port,
    '--db', DB_PATH,
    '--version', version,
    '--content-service-origin', `${endpoints.TOFINO_PROTOCOL}://`,
  ], {
    detached,
    stdio,
  }));

  // Connecting to a client immediately is sometimes not necessary,
  // e.g. when starting this service standalone.
  if (userAgentClient) {
    userAgentClient.connect({ port, host, version });
  }
}

export function startContentService(options = {}) {
  const detached = !options.attached; // Detach by default
  const stdio = detached ? ['ignore'] : ['ignore', process.stdout, process.stderr];

  children.push(spawn('node', [CONTENT_SERVICE_PATH], {
    detached,
    stdio,
  }));
}

// Some builds always kill spawned services for easy debugging.
// See https://github.com/mozilla/tofino/issues/607 for more background.
if (!BUILD_CONFIG.keepAliveAppServices) {
  process.on('exit', () => terminateSpawnedProcesses('SIGTERM'));
  process.on('SIGINT', () => terminateSpawnedProcesses('SIGTERM'));
  process.on('SIGTERM', () => terminateSpawnedProcesses('SIGTERM'));
}

function terminateSpawnedProcesses(code) {
  children.forEach(c => c.kill(code));
}
