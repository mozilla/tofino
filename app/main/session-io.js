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

import { ipcMain } from 'electron';
import { get, set, del } from 'object-path';
import fs from 'fs';
import path from 'path';
import queue from 'queue';
import colors from 'colors/safe';

import { parseArgs } from '../shared/environment';
import { logger } from '../shared/logging';

const PROFILE = parseArgs().profile;
const SESSION_FILE = path.join(PROFILE, 'session.json');
logger.info(colors.blue('Using'), colors.green(SESSION_FILE));

// Avoid synchronous (potentially frequent) read/writes to/from the filesystem
// by using the asynchronous `fs` APIs a simple task queue.
const IO = queue({
  concurrency: 1,
});

// Cache the session when starting the main process so that we're not
// reading from disk every time something needs to be accessed.
const SESSION = (function() {
  try {
    return JSON.parse(fs.readFileSync(SESSION_FILE, 'utf8'));
  } catch (e) {
    logger.info(colors.yellow('Couldn\'t load session.'));
    return Object.create(null);
  }
}());

export function getSessionKey(key, options = {}) {
  return get(SESSION, key, options.default);
}

export function setSessionKey(key, value) {
  set(SESSION, key, value);
  IO.push(cb => fs.writeFile(SESSION_FILE, JSON.stringify(SESSION, null, 2), 'utf-8', cb));
  IO.start();
  logger.info(`${colors.green('Set ')}${key}`);
}

export function delSessionKey(key) {
  del(SESSION, key);
  IO.push(cb => fs.writeFile(SESSION_FILE, JSON.stringify(SESSION, null, 2), 'utf-8', cb));
  IO.start();
  logger.info(`${colors.red('Del ')}${key}`);
}

ipcMain.on('session:getkey', (event, key) => {
  getSessionKey(key);
});

ipcMain.on('session:setkey', (event, key, value) => {
  setSessionKey(key, value);
});

ipcMain.on('session:delkey', (event, key) => {
  delSessionKey(key);
});
