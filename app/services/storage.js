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
import microtime from 'microtime';
import path from 'path';
import thenify from 'thenify';

import { DB, verbose } from './sqlite';

const mkdirp = thenify(cbmkdirp);

/**
 * Public API:
 *
 *   ProfileStorage.open(dir)
 *   storage.visit(url, microseconds)
 *   storage.visited(since, limit)
 *   storage.close()
 */
export class ProfileStorage {
  constructor(db) {
    this.db = db;
    this.places = new Map();
    this.nextPlace = 0;
  }

  /**
   * Open a database and return a promise-based wrapper.
   * @param dir the containing directory.
   * @returns {Promise}
   */
  static async open(dir) {
    verbose();

    const filePath = path.join(dir, 'browser.db');
    console.log(`Database path is ${filePath}.`);

    await mkdirp(dir);
    const db = await DB.open(filePath);
    return new ProfileStorage(db).init();
  }

  /**
   * Load the place map out of the DB.
   */
  async loadPlaces() {
    this.places.clear();

    const rows = await this.db.all('SELECT url, id FROM placeEvents');
    let max = 0;
    for (const row of rows) {
      const id = row.id;
      if (id > max) {
        max = id;
      }
      this.places.set(row.url, id);
    }

    this.nextPlace = max + 1;
    return max;
  }

  async savePlace(url, now = microtime.now()) {
    if (this.places.has(url)) {
      return this.places.get(url);
    }

    // We don't use INSERT OR IGNORE -- we want to fail if our write-through cache breaks.
    // We also aggressively increment, so any race here is less likely to cause problems.
    const id = this.nextPlace++;
    const args = [id, url, now];
    await this.db.run('INSERT INTO placeEvents (id, url, ts) VALUES (?, ?, ?)', args);
    this.places.set(url, id);
    return id;
  }

  async visit(url, now = microtime.now()) {
    const id = await this.savePlace(url, now);
    return this.db.run('INSERT INTO visitEvents (place, ts) VALUES (?, ?)', [id, now]);
  }

  // Ordered by last visit, descending.
  async visited(since = 0, limit = 10) {
    const out = [];

    // Fetch all places visited, with the latest timestamp for each.
    const sub = `SELECT place, MAX(ts) AS latest
    FROM visitEvents WHERE ts >= ?
    GROUP BY place ORDER BY latest DESC
    LIMIT ?`;

    // Grab URLs, too.
    const withURLs = `SELECT p.url AS url, v.latest AS latest
    FROM placeEvents AS p JOIN (${sub}) AS v
    ON p.id = v.place
    ORDER BY latest DESC`;

    const rows = await this.db.all(withURLs, [since, limit]);

    for (const row of rows) {
      out.push(row.url);
    }
    return out;
  }

  async init() {
    const schema = new ProfileStorageSchemaV1();
    const v = await schema.createOrUpdate(this);

    if (v !== schema.version) {
      throw new Error(`Incorrect version ${v}; expected ${schema.version}.`);
    }

    const loaded = await this.loadPlaces();
    console.log(`Loaded ${loaded} places.`);

    return this;
  }

  close() {
    return this.db.close();
  }

  userVersion() {
    return this.db
               .get('PRAGMA user_version')
               .then((row) => Promise.resolve(row.user_version));
  }
}

class ProfileStorageSchemaV1 {
  constructor() {
    this.version = 1;
  }

  /**
   * Take a newly opened ProfileStorage and make sure it reaches v1.
   * @param storage an open storage instance.
   */
  async createOrUpdate(storage) {
    const v = await storage.userVersion();

    if (v === this.version) {
      console.log(`Storage already at version ${v}.`);
      return v;
    }

    switch (v) {
      case 0:
        console.log(`Creating storage at version ${this.version}.`);
        return this.create(storage);
      default:
        throw new Error(`Target version ${this.version} lower than DB version ${v}!`);
    }
  }

  async create(storage) {
    // Associate URLs with persistent IDs.
    // Note the use of AUTOINCREMENT to ensure that IDs are never reused after deletion.
    const tablePlaces = `CREATE TABLE placeEvents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT UNIQUE NOT NULL,
    ts INTEGER NOT NULL
    )`;

    // Associate visits with places.
    const tableVisits = `CREATE TABLE visitEvents (
    place INTEGER NOT NULL REFERENCES placeEvents(id),
    ts INTEGER NOT NULL
    )`;

    await storage.db.run(tablePlaces);
    await storage.db.run(tableVisits);
    await storage.db.run('PRAGMA user_version = 1');

    return storage.userVersion();
  }
}
