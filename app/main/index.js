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
import { addToWindowsRegistry, removeFromWindowsRegistry } from './protocols';

process.on('uncaughtException', err => {
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

// See https://github.com/Squirrel/Squirrel.Windows/blob/master/docs/using/custom-squirrel-events-non-cs.md#application-startup-commands

const SQUIRREL_VERSION_EVENTS = [
  'squirrel-install',
  'squirrel-updated',
  'squirrel-uninstall',
  'squirrel-obsolete',
];
const SQUIRREL_FIRSTRUN_EVENT = 'squirrel-firstrun';

for (const event of SQUIRREL_VERSION_EVENTS) {
  argParser.option(event, {
    default: undefined,
    type: 'string',
  });
}

argParser.boolean(SQUIRREL_FIRSTRUN_EVENT);

// Check if a squirrel event flag was passed. Any additional command line
// arguments must be registered before here
let seenEvent = null;
const options = parseArgs();

if (options[SQUIRREL_FIRSTRUN_EVENT]) {
  seenEvent = SQUIRREL_FIRSTRUN_EVENT;
} else {
  for (const event of SQUIRREL_VERSION_EVENTS) {
    if (options[event]) {
      seenEvent = event;
      break;
    }
  }
}

switch (seenEvent) {
  // When there was no event or the first-run event just let the app start
  // normally.
  case SQUIRREL_FIRSTRUN_EVENT:
  case null:
    require('./browser');
    break;

  case 'squirrel-install':
    addToWindowsRegistry().catch(e => {
      logger.error(e);
    }).then(() => {
      app.quit();
    });
    break;

  case 'squirrel-uninstall':
    removeFromWindowsRegistry().catch(e => {
      logger.error(e);
    }).then(() => {
      app.quit();
    });
    break;

  // For all other events quit the app.
  default:
    app.quit();
    break;
}
