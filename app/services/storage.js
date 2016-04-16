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
 * @module ProfileStorage
 */

import cbmkdirp from 'less-mkdirp';
import path from 'path';
import thenify from 'thenify';

import { DB, verbose } from './sqlite';

const mkdirp = thenify(cbmkdirp);

export class ProfileStorage {
  constructor(db) {
    this.db = db;
  }

  /**
   * Open a database and return a promise-based wrapper.
   * @param dir the containing directory.
   * @returns {Promise}
   */
  static open(dir) {
    verbose();

    const filePath = path.join(dir, 'browser.db');
    console.log(`Database path is ${filePath}.`);

    return mkdirp(dir).then(() =>
      DB.open(filePath)
        .then((db) => Promise.resolve(new ProfileStorage(db)))
    );
  }

  close() {
    return this.db.close();
  }

  logUserVersion() {
    return this.db.get('PRAGMA user_version')
               .then((row) => {
                 console.log(`User version: ${row.user_version}.`);
               })
               .catch((err) => {
                 console.log(`Unable to fetch DB user_version: ${err}.`);
               });
  }
}
