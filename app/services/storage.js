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
import microtime from 'microtime-fast';
import path from 'path';
import thenify from 'thenify';

import { DB, verbose } from './sqlite';

const mkdirp = thenify(cbmkdirp);

export const VisitType = {
  unknown: 0,
};

export const StarOp = {
  unstar: -1,
  star: 1,
};

/**
 * Public API:
 *
 *   let storage = await ProfileStorage.open(dir);
 *   let session = await storage.startSession(scope, ancestor);
 *   await storage.visit(url, session, microseconds);
 *   let visitedURLs = await storage.visited(since, limit);
 *   await storage.close();
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

  close() {
    this.places.clear();
    this.nextPlace = 0;
    return this.db.close();
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

  async init() {
    await this.db.exec('PRAGMA foreign_keys = ON');

    const schema = new ProfileStorageSchemaV3();
    const v = await schema.createOrUpdate(this);

    if (v !== schema.version) {
      throw new Error(`Incorrect version ${v}; expected ${schema.version}.`);
    }

    const loaded = await this.loadPlaces();
    console.log(`Loaded ${loaded} places.`);

    return this;
  }

  /**
   * Begins a transaction and runs `f`. If `f` returns a promise that rejects,
   * rolls back the transaction and passes through the rejection. If `f` resolves
   * to a value, commits the transaction and passes through the resolved value.
   *
   * @param f the function to call within a transaction.
   * @returns {*} the result or rejection of `f`.
   */
  inTransaction(f) {
    return this.db
               .run('BEGIN TRANSACTION')
               .then(f)
               .then((result) =>
                 this.db
                     .run('COMMIT')
                     .then(() => Promise.resolve(result)))
               .catch((err) =>
                 this.db.run('ROLLBACK')
                     .then(() => Promise.reject(err)));
  }

  /**
   * Saves a place, expecting a transaction to be established if necessary.
   * Does not update `this.places`! Callers should do that once the entire
   * transaction completes.
   *
   * @param url the URL to store.
   * @param now the current timestamp.
   * @returns {*} the place ID.
   */
  async savePlaceWithoutEstablishingTransaction(url, now) {
    // We don't use INSERT OR IGNORE -- we want to fail if our write-through cache breaks.
    // We also aggressively increment, so any race here is less likely to cause problems.
    const id = this.nextPlace++;
    const args = [id, url, now];
    await this.db.run('INSERT INTO placeEvents (id, url, ts) VALUES (?, ?, ?)', args);
    return id;
  }

  savePlace(url, now = microtime.now()) {
    if (this.places.has(url)) {
      return Promise.resolve(this.places.get(url));
    }

    return this.savePlaceWithoutEstablishingTransaction(url, now)
               .then((id) => this.savePlaceIDMapping(url, id));
  }

  /**
   * Store a visit for a given place ID. Chains through the place ID.
   */
  saveVisitForPlaceWithoutEstablishingTransaction(place, session, now = microtime.now()) {
    return this.db
               .run('INSERT INTO visitEvents (place, session, ts, type) VALUES (?, ?, ?, ?)',
                    [place, session, now, VisitType.unknown])
               .then(() => Promise.resolve(place));
  }

  /**
   * Store a title for a given place ID. Chains through the place ID. Writes nothing if the
   * title is undefined.
   */
  saveTitleForPlaceWithoutEstablishingTransaction(place, title, now = microtime.now()) {
    if (title === undefined) {
      return Promise.resolve(place);
    }

    return this.db
               .run('INSERT INTO titleEvents (place, title, ts) VALUES (?, ?, ?)',
                    [place, title, now])
               .then(() => Promise.resolve(place));
  }

  savePlaceIDMapping(url, id) {
    this.places.set(url, id);
    return Promise.resolve(id);
  }

  async startSession(scope, ancestor, now = microtime.now()) {
    const result =
      await this.db
                .run('INSERT INTO sessionStarts (scope, ancestor, ts) VALUES (?, ?, ?)',
                     [scope, ancestor, now]);
    return result.lastID;
  }

  // Chains through place ID.
  starPage(url, session, action, now = microtime.now()) {
    if (action !== StarOp.star && action !== StarOp.unstar) {
      return Promise.reject(new Error(`Unknown action ${action}.`));
    }

    const star = (place) =>
      this.db
          .run('INSERT INTO starEvents (place, session, action, ts) VALUES (?, ?, ?, ?)',
               [place, session, action, now])
          .then(() => Promise.resolve(place));

    if (this.places.has(url)) {
      return star(this.places.get(url));
    }

    return this.inTransaction(() =>
                 this.savePlaceWithoutEstablishingTransaction(url, now)
                     .then(star))

               // If the transaction committed, keep the URL -> ID mapping in memory.
               .then((id) => this.savePlaceIDMapping(url, id));
  }

  /**
   * Record a visit to a URL.
   * @param url the visited URL.
   * @param title (optional) a known title for the page.
   * @param now (optional) microsecond timestamp.
   * @returns {Promise} a promise that resolves to the place ID.
   */
  visit(url, session, title, now = microtime.now()) {
    if (this.places.has(url)) {
      const place = this.places.get(url);

      if (title === undefined) {
        // Don't bother establishing a transaction if we're not going to write a title.
        return this.saveVisitForPlaceWithoutEstablishingTransaction(place, session, now);
      }

      return this.inTransaction(() =>
        this.saveVisitForPlaceWithoutEstablishingTransaction(place, session, now)
            .then(() => this.saveTitleForPlaceWithoutEstablishingTransaction(place, title, now)));
    }

    return this.inTransaction(() =>
                 this.savePlaceWithoutEstablishingTransaction(url, now)
                     .then((id) =>
                       this.saveVisitForPlaceWithoutEstablishingTransaction(id, session, now))
                     .then((id) =>
                       this.saveTitleForPlaceWithoutEstablishingTransaction(id, title, now)))

               // If the transaction committed, keep the URL -> ID mapping in memory.
               .then((id) => this.savePlaceIDMapping(url, id));
  }

  collectURLs(rows) {
    const out = [];
    for (const row of rows) {
      out.push(row.url);
    }
    return out;
  }

  // TODO: check titles, too.
  // TODO: include titles.
  async visitedMatches(substring, since = 0, limit = 10) {
    // Fetch all places visited, with the latest timestamp for each.
    // We can't limit here, because we don't know matching URLs.
    // TODO: inverting this query might work better if `since` is long ago.
    const sub = `SELECT place, MAX(ts) AS latest
    FROM visitEvents WHERE ts >= ?
    GROUP BY place`;

    const like = `%${substring}%`;

    // Grab URLs, too.
    const withURLs = `SELECT p.url AS url, v.latest AS latest
    FROM placeEvents AS p JOIN (${sub}) AS v
    ON p.id = v.place
    WHERE url LIKE ?
    ORDER BY latest DESC
    LIMIT ?`;

    return this.collectURLs(await this.db.all(withURLs, [since, like, limit]));
  }

  // TODO: include titles.
  // Ordered by last visit, descending.
  async visited(since = 0, limit = 10) {
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

    return this.collectURLs(await this.db.all(withURLs, [since, limit]));
  }

  userVersion() {
    return this.db
               .get('PRAGMA user_version')
               .then((row) => Promise.resolve(row.user_version));
  }
}


// Associate URLs with persistent IDs.
// Note the use of AUTOINCREMENT to ensure that IDs are never reused after deletion.
const tablePlacesV3 = `CREATE TABLE placeEvents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  url TEXT UNIQUE NOT NULL,
  ts INTEGER NOT NULL
)`;

// Associate titles with places.
const tableTitlesV3 = `CREATE TABLE titleEvents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  place INTEGER NOT NULL REFERENCES placeEvents(id),
  ts INTEGER NOT NULL,
  title TEXT NOT NULL
)`;

// Associate visits with places.
const tableVisitsV3 = `CREATE TABLE visitEvents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  place INTEGER NOT NULL REFERENCES placeEvents(id),
  ts INTEGER NOT NULL,
  session INTEGER NOT NULL REFERENCES sessionStarts(id),
  type INTEGER NOT NULL
)`;

// Track the start of a session. Note that each session has a unique identifier, can
// be born of another (the ancestor), and can be within a scope (e.g., a window ID).
const tableSessionStartsV3 = `CREATE TABLE sessionStarts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  scope INTEGER,
  ancestor INTEGER REFERENCES sessionStarts(id),
  ts INTEGER NOT NULL
)`;

// Track the end of a session. Note that sessions must be started before they are
// ended.
const tableSessionEndsV3 = `CREATE TABLE sessionEnds (
  id INTEGER PRIMARY KEY REFERENCES sessionStarts(id),
  ts INTEGER NOT NULL
)`;

const tableStarsV3 = `CREATE TABLE starEvents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  place INTEGER NOT NULL REFERENCES placeEvents(id),
  session INTEGER NOT NULL REFERENCES sessionStarts(id),
  action TINYINT NOT NULL,
  ts INTEGER NOT NULL
)`;

class ProfileStorageSchemaV3 {
  constructor() {
    this.version = 3;
  }

  /**
   * Take a newly opened ProfileStorage and make sure it reaches v3.
   * @param storage an open storage instance.
   */
  async createOrUpdate(storage) {
    const v = await storage.userVersion();

    if (v === this.version) {
      console.log(`Storage already at version ${v}.`);
      return v;
    }

    if (v === 0) {
      console.log(`Creating storage at version ${this.version}.`);
      return this.create(storage);
    }

    if (v < this.version) {
      console.log(`Updating storage from ${v} to ${this.version}.`);
      return this.update(storage, v);
    }

    throw new Error(`Target version ${this.version} lower than DB version ${v}!`);
  }

  async update(storage, from) {
    // Precondition: from < this.version.
    // Precondition: from > 0 (else we'd call `create`).
    switch (from) {
      case 1:
        await storage.db.run(tableTitlesV3);
        await storage.db.run(tableSessionStartsV3);
        await storage.db.run(tableSessionEndsV3);
        await storage.db.run(tableStarsV3);

        // Change the schema for visits. Lose existing ones.
        await storage.db.run('DROP TABLE visitEvents');
        await storage.db.run(tableVisitsV3);

        await storage.db.run(`PRAGMA user_version = ${this.version}`);
        break;

      case 2:
        await storage.db.run(tableStarsV3);

        // We gave titles and visits IDs.
        await storage.db.run('DROP TABLE visitEvents');
        await storage.db.run('DROP TABLE titleEvents');
        await storage.db.run(tableVisitsV3);
        await storage.db.run(tableTitlesV3);
        await storage.db.run(`PRAGMA user_version = ${this.version}`);
        break;

      default:
        throw new Error('Can\'t upgrade from anything other than v1 or v2.');
    }

    return storage.userVersion();
  }

  async create(storage) {
    await storage.db.run(tablePlacesV3);
    await storage.db.run(tableTitlesV3);
    await storage.db.run(tableVisitsV3);
    await storage.db.run(tableStarsV3);
    await storage.db.run(tableSessionStartsV3);
    await storage.db.run(tableSessionEndsV3);
    await storage.db.run(`PRAGMA user_version = ${this.version}`);

    return storage.userVersion();
  }
}
