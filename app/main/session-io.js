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

import fs from 'fs';
import { join } from 'path';

import { ipcMain } from 'electron';
import { get, set, del } from 'object-path';
import colors from 'colors/safe';

import { parseArgs } from '../shared/environment';
import { logger } from '../shared/logging';
import Queue from '../shared/queue';

/**
 * This module provides an API for persisting state after application exits,
 * offering simple key-value storage. All consumers are expected to manage
 * their own key spaces. Keys can be more complex paths as well, e.g.
 * 'foo.bar.baz' or ['foo', 'bar', 'baz'], in which case intermediary
 * structures are created if they don't exist.
 */

const PROFILE = parseArgs().profile;
const SESSION_FILE = join(PROFILE, 'session.json');

// Avoid synchronous (potentially frequent) read/writes to/from the filesystem
// by using the asynchronous `fs` APIs and simple task queue.
const IO = new Queue({
  concurrency: 1,
});

// Cache the session when starting the main process so that we're not
// reading from disk every time something needs to be accessed.
const SESSION = (function() {
  try {
    logger.info(colors.blue('Using'), colors.green(SESSION_FILE));
    return JSON.parse(fs.readFileSync(SESSION_FILE, 'utf8'));
  } catch (e) {
    logger.info(colors.yellow('Couldn\'t read or parse session.'));
    return Object.create(null);
  }
}());

export function getSessionKey(path, options = {}) {
  return get(SESSION, path, options.default);
}

export function setSessionKey(path, value) {
  set(SESSION, path, value);
  IO.push(cb => fs.writeFile(SESSION_FILE, JSON.stringify(SESSION, null, 2), 'utf-8', cb));
  logger.info(`${colors.green('Set ')}${path}`);
}

export function deleteSessionKey(path) {
  del(SESSION, path);
  IO.push(cb => fs.writeFile(SESSION_FILE, JSON.stringify(SESSION, null, 2), 'utf-8', cb));
  logger.info(`${colors.red('Del ')}${path}`);
}

ipcMain.on('session-set-key', (event, path, value) => {
  setSessionKey(path, value);
});

ipcMain.on('session-delete-key', (event, path) => {
  deleteSessionKey(path);
});
