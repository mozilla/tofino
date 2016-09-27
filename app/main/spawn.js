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
/* global LIBDIR */

import os from 'os';
import colors from 'colors/safe';
import path from 'path';
import { spawn } from 'child_process';
import { logger } from '../shared/logging';
import * as endpoints from '../shared/constants/endpoints';
import { parseArgs } from '../shared/environment';

const NODE_CMD = os.platform() === 'win32' ? 'node.exe' : 'node';

// @TODO Use something like `forever` or `pm2` to ensure that this
// process remains running

const children = new Set();

function spawnProcess(name, command, args, options) {
  logger.info(colors.cyan('Executing'), colors.gray(`${command} ${args.join(' ')}`));

  const child = spawn(command, args, options);
  children.add(child);

  child.on('error', error => {
    logger.error(`${name} threw error ${error}`);
  });

  child.on('exit', code => {
    children.delete(child);

    // The code is missing when the child was killed by a signal
    if (code === null) {
      return;
    }

    // Generally the services shouldn't exit while this process is still running
    // so this is an error regardless of the exit code.
    logger.error(`${name} exited with exit code ${code}`);
  });

  return child;
}

export function startUserAgentService(userAgentClient, options = {}) {
  const port = options.port || endpoints.UA_SERVICE_PORT;
  const host = options.host || endpoints.UA_SERVICE_ADDR;
  const version = options.version || endpoints.UA_SERVICE_VERSION;
  const contentServiceOrigin = options.contentServiceOrigin || `${endpoints.TOFINO_PROTOCOL}://`;

  // Careful passing in options.attached as true, as this stops the service from
  // outliving the its original parent, which we want to allow in the UAS case.
  const detached = !options.attached; // Detach by default
  const stdio = detached ? ['ignore'] : ['ignore', process.stdout, process.stderr];
  const lib = options.libdir || LIBDIR;
  const profile = options.profiledir || parseArgs().profile;

  const NODE = path.join(lib, NODE_CMD);
  const UA_SERVICE_BIN = path.join(lib, 'services', 'user-agent-service', 'user-agent-service');

  const child = spawnProcess('UA Service', NODE, [UA_SERVICE_BIN,
    '--port', port,
    '--profile', profile,
    '--version', version,
    '--content-service-origin', contentServiceOrigin,
  ], {
    detached,
    stdio,
  });

  // Connecting to a client immediately is sometimes not necessary,
  // e.g. when starting this service standalone.
  let connected = null;
  if (userAgentClient) {
    connected = userAgentClient.connect({ port, host, version });
  }

  const stop = () => {
    child.kill('SIGTERM');
  };

  return { connected, stop, child };
}

export function startContentService(options = {}) {
  const detached = !options.attached; // Detach by default
  const stdio = detached ? ['ignore'] : ['ignore', process.stdout, process.stderr];
  const lib = options.libdir || LIBDIR;
  const profile = options.profiledir || parseArgs().profile;

  const NODE = path.join(lib, NODE_CMD);
  const CONTENT_SERVICE_PATH = path.join(lib, 'services', 'content-service', 'index.js');

  spawnProcess('Content service', NODE, [CONTENT_SERVICE_PATH,
    '--profile', profile,
  ], {
    detached,
    stdio,
  });
}

process.on('exit', () => terminateSpawnedProcesses('SIGTERM'));
process.on('SIGINT', () => terminateSpawnedProcesses('SIGTERM'));
process.on('SIGTERM', () => terminateSpawnedProcesses('SIGTERM'));

function terminateSpawnedProcesses(code) {
  children.forEach(c => c.kill(code));
}
