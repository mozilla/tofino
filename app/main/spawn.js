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

const DB_PATH = path.join(__dirname, '..', '..');
const SERVICES_PATH = path.join(__dirname, '..', 'services');
const UA_SERVICE_BIN = path.join(SERVICES_PATH, 'user-agent-service', 'bin', 'user-agent-service');
const CONTENT_SERVICE_PATH = path.join(SERVICES_PATH, 'content-service', 'index.js');

// @TODO Use something like `forever` or `pm2` to ensure that this
// process remains running
// @TODO Will `node` be accessible via path on users machines that don't
// have node installed as an engineer?
export function startUserAgentService() {
  spawn('node', [UA_SERVICE_BIN,
    '--port', endpoints.UA_SERVICE_PORT,
    '--db', DB_PATH,
    '--version', endpoints.UA_SERVICE_VERSION,
    '--content-service', endpoints.CONTENT_SERVER_ORIGIN,
  ], {
    detached: true,
    stdio: ['ignore', process.stdout, process.stderr],
  });
}

export function startContentService() {
  const child = spawn('node', [CONTENT_SERVICE_PATH], {
    detached: true,
    stdio: ['ignore', process.stdout, process.stderr],
  });

  process.on('exit', () => {
    child.kill('SIGKILL');
  });
}
