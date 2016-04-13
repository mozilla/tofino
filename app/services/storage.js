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

/* eslint no-console: 0 */

/**
 * The storage module that makes up the majority of the profile service.
 *
 * @module Storage
 */

import sqlite3 from 'sqlite3';

export function open(path) {
  sqlite3.verbose();

  const db = new sqlite3.Database(path);
  db.get('PRAGMA user_version', (err, row) => {
    if (err) {
      console.log('Unable to fetch DB user_version.');
      return;
    }
    console.log(`User version: ${row.user_version}.`);
  });

  return db;
}
