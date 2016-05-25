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

const UA_SERVICE_PATH = path.join(__dirname, '..', 'services', 'user-agent-service', 'index');
const CONTENT_SERVICE_PATH = path.join(__dirname, '..', 'services', 'content-service', 'index');

// @TODO Use something like `forever` or `pm2` to ensure that this
// process remains running
export function userAgentService() {
  spawn('node', [UA_SERVICE_PATH], {
    detached: true,
  });
  spawn('node', [CONTENT_SERVICE_PATH], {
    detached: true,
  });
}
