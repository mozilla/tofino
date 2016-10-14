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

import { logger } from '../../../shared/logging';

/**
 * This module provides utility functions for performing forward migration
 * on different versions of the app state.
 */

// Whenever app state shape changes, migration functions need to be added here.
// Add the obsolete or missing record names as keys, and a migration function
// taking the data to migrate as a basic Immutable.Map, and having to return it
// in the new format.
const MIGRATIONS = {
  // e.g. migrate MyRecord from v1 to v2:
  // MyRecord_v1(value) {
  //   ... update value to adhere to the v2 record shape ...
  //   return MIGRATIONS.MyRecord_v2(value);
  // },

  // e.g. migrate MyRecord from v2 to latest:
  // MyRecord_v2(value) {
  //   ... update value to adhere to the latest record shape ...
  //   const MyRecord_latest = require('../model/my-record');
  //   return new MyRecord_latest(value);
  // },

  // e.g. migrate ObsoleteRecord which doesn't exist anymore in the new format:
  // ObsoleteRecord_v3(value) {
  //   return undefined;
  // },
};

export function migrateObsoleteOrDeprecatedRecord(name, value) {
  logger.info(`Missing \`${name}\` record with exact version when deserializing app state.`);
  logger.info('Attempting migration.');

  if (name in MIGRATIONS) {
    const migrator = MIGRATIONS[name];
    return migrator(value);
  }

  logger.error(`No migration found for \`${name}\`.`);
  throw new Error('Migration failed.');
}
