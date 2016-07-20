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

/* eslint import/imports-first: "off" */
/* eslint global-require: "off" */

import { logger } from '../shared/logging';
import 'source-map-support/register';

process.on('uncaughtException', (err) => {
  logger.error(err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, p) => {
  logger.error(`Unhandled Rejection at: Promise ${JSON.stringify(p)}`);
  logger.error(reason.stack);
  process.exit(2);
});

import { app } from 'electron';
import { argParser, parseArgs } from '../shared/environment';

const SQUIRREL_EVENTS = [
  'squirrel-install',
  'squirrel-updated',
  'squirrel-uninstall',
  'squirrel-obsolete',
];
argParser.boolean(SQUIRREL_EVENTS);

// For now we don't actually do anything on squirrel events, just let the app
// exit.
function handledSquirrelEvent() {
  const options = parseArgs();

  for (const event of SQUIRREL_EVENTS) {
    if (options[event]) {
      return true;
    }
  }

  return false;
}

// Any additional command line arguments must be registered before calling this
// function which will parse the arguments.
if (handledSquirrelEvent()) {
  app.quit();
} else {
  require('./browser');
}
