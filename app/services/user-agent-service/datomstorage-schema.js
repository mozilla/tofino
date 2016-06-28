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

import { logger } from '../../shared/logging';

const debug = false;

const tableDatomsV1 = `CREATE TABLE datoms (
  e INTEGER,
  a TEXT NOT NULL,
  v BLOB NOT NULL,
  tx INTEGER NOT NULL
)`;

const tableTransactionsV1 = `CREATE TABLE transactions (
  e INTEGER,
  a TEXT NOT NULL,
  v BLOB NOT NULL,
  tx INTEGER NOT NULL,
  added TINYINT DEFAULT 1
)`;

const indexEAVTV1 = 'CREATE INDEX eavt ON datoms (e, a)';

const indexTransactionsV1 = 'CREATE INDEX transactions_tx ON transactions (tx)';

export class DatomStorageSchemaV1 {
  constructor() {
    this.version = 1;
  }

  /**
   * Take a newly opened storage and make sure it reaches v1.
   * @param storage an open storage instance.
   */
  async createOrUpdate(storage) {
    const v = await storage.userVersion();

    if (v === this.version) {
      if (debug) {
        logger.info(`Datom storage already at version ${v}.`);
      }
      return v;
    }

    if (v === 0) {
      if (debug) {
        logger.info(`Creating datom storage at version ${this.version}.`);
      }
      return this.create(storage);
    }

    if (v < this.version) {
      if (debug) {
        logger.info(`Updating datom storage from ${v} to ${this.version}.`);
      }
      return this.update(storage, v);
    }

    throw new Error(`Target version ${this.version} lower than DB version ${v}!`);
  }

  async update(storage, from) {
    // Precondition: from < this.version.
    // Precondition: from > 0 (else we'd call `create`).
    switch (from) {
      default:
        throw new Error(`Can\'t upgrade from ${from}: outside {v0}`);
    }

    // return storage.userVersion();
  }

  async create(storage) {
    // Tables.
    await storage.db.run(tableDatomsV1);
    await storage.db.run(tableTransactionsV1);

    // Indexes.
    await storage.db.run(indexEAVTV1);
    await storage.db.run(indexTransactionsV1);

    await storage.db.run(`PRAGMA user_version = ${this.version}`);

    return storage.userVersion();
  }
}
