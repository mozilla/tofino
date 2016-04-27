/* @flow */

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
  db: Object;
  places: Map<string, number>;
  nextPlace: number;

  constructor(db: Object) {
    this.db = db;
    this.places = new Map();
    this.nextPlace = 0;
  }

  /**
   * Open a database and return a promise-based wrapper.
   * @param dir the containing directory.
   * @returns {Promise}
   */
  static async open(dir: string): Promise<ProfileStorage> {
    verbose();

    const filePath = path.join(dir, 'browser.db');
    console.log(`Database path is ${filePath}.`);

    await mkdirp(dir);
    const db = await DB.open(filePath);
    return new ProfileStorage(db).init();
  }

  close(): Promise<void> {
    this.places.clear();
    this.nextPlace = 0;
    return this.db.close();
  }

  /**
   * Load the place map out of the DB.
   */
  async loadPlaces(): Promise<number> {
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

  async init(): Promise<ProfileStorage> {
    await this.db.exec('PRAGMA foreign_keys = ON');

    const schema = new ProfileStorageSchemaV4();
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
  inTransaction<T>(f: () => Promise<T>): Promise<T> {
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
   * If the URL is already known, returns the place ID immediately.
   *
   * @param url the URL to store.
   * @param now the current timestamp.
   * @returns {*} the place ID.
   */
  async savePlaceWithoutEstablishingTransaction(url: string, now: number): Promise<number> {
    if (this.places.has(url)) {
      return this.places.get(url);
    }

    // We don't use INSERT OR IGNORE -- we want to fail if our write-through cache breaks.
    // We also aggressively increment, so any race here is less likely to cause problems.
    const id = this.nextPlace++;
    const args = [id, url, now];
    await this.db.run('INSERT INTO placeEvents (id, url, ts) VALUES (?, ?, ?)', args);
    return id;
  }

  savePlace(url: string, now: number = microtime.now()): Promise<number> {
    const place = this.places.get(url);
    if (place) {
      return Promise.resolve(place);
    }

    return this.savePlaceWithoutEstablishingTransaction(url, now)
               .then((id) => this.savePlaceIDMapping(url, id));
  }

  /**
   * Store a visit for a given place ID. Chains through the place ID.
   */
  saveVisitForPlaceWithoutEstablishingTransaction(place: number,
                                                  session: number,
                                                  now: number = microtime.now()): Promise<number> {
    return this.db
               .run('INSERT INTO visitEvents (place, session, ts, type) VALUES (?, ?, ?, ?)',
                    [place, session, now, VisitType.unknown])
               .then(() => Promise.resolve(place));
  }

  /**
   * Store a title for a given place ID. Chains through the place ID. Writes nothing if the
   * title is undefined.
   */
  saveTitleForPlaceWithoutEstablishingTransaction(place: number,
                                                  title: ?string,
                                                  now: number = microtime.now()): Promise<number> {
    if (title === undefined) {
      return Promise.resolve(place);
    }

    return this.db
               .run('INSERT INTO titleEvents (place, title, ts) VALUES (?, ?, ?)',
                    [place, title, now])
               .then(() => Promise.resolve(place));
  }

  savePlaceIDMapping(url: string, id: number): Promise<number> {
    this.places.set(url, id);
    return Promise.resolve(id);
  }

  async startSession(scope: ?number,
                     ancestor: ?number,
                     now: number = microtime.now()): Promise<number> {
    const result =
      await this.db
                .run('INSERT INTO sessionStarts (scope, ancestor, ts) VALUES (?, ?, ?)',
                     [scope, ancestor, now]);
    return result.lastID;
  }

  async materializeStars() {
    await this.db.run('DELETE FROM mStarred');
    await this.db.run('INSERT INTO mStarred SELECT place, ts, url FROM vStarred');
  }

  async materializeHistory() {
    await this.db.run('DELETE FROM mHistory');
    await this.db.run(`INSERT INTO mHistory
      SELECT place, url, lastTitle, lastVisited, visitCount
      FROM vHistory
    `);
  }

  async rematerialize() {
    await this.materializeHistory();
    await this.materializeStars();
  }

  /**
   * Update the contents of the `mStarred` materialized view in response to a starring change.
   * This implementation depends on the ordering of star/unstar events being strictly:
   *
   *   1, -1, 1, -1, 1, -1, …
   *
   * Any other order will result in inconsistency. An alternative implementation is to do a partial
   * rebuild -- exactly the normal materialization query, but with a `WHERE place = ?` clause added.
   */
  updateMaterializedStars(url: string,
                          place: number,
                          session: number,
                          action: number,
                          now: number = microtime.now()) {
    switch (action) {
      case StarOp.star:
        return this.db.run('INSERT OR REPLACE INTO mStarred (place, ts, url) VALUES (?, ?, ?)',
                           [place, now, url]);
      case StarOp.unstar:
        return this.db.run('DELETE FROM mStarred WHERE place = ?', [place]);

      default:
        return Promise.reject(new Error(`Unknown action ${action}.`));
    }
  }

  // Chains through place ID.
  starPage(url: string,
           session: number,
           action: number,
           now: number = microtime.now()): Promise<number> {
    if (action !== StarOp.star && action !== StarOp.unstar) {
      return Promise.reject(new Error(`Unknown action ${action}.`));
    }

    const star = (place: number): Promise<number> =>
      this.db
          .run('INSERT INTO starEvents (place, session, action, ts) VALUES (?, ?, ?, ?)',
               [place, session, action, now])

          // Update materialized views.
          .then(() => this.updateMaterializedStars(url, place, session, action, now))
          .then(() => Promise.resolve(place));

    const place = this.places.get(url);
    if (place) {
      return star(place);
    }

    return this.inTransaction(() =>
                 this.savePlaceWithoutEstablishingTransaction(url, now)
                     .then(star))

               // If the transaction committed, keep the URL -> ID mapping in memory.
               .then((id) => this.savePlaceIDMapping(url, id));
  }

  async recordVisitWithoutEstablishingTransaction(url: string,
                                                  session: number,
                                                  title: ?string,
                                                  now: number = microtime.now()): Promise<number> {
    const place = await this.savePlaceWithoutEstablishingTransaction(url, now);
    await this.saveVisitForPlaceWithoutEstablishingTransaction(place, session, now);
    await this.saveTitleForPlaceWithoutEstablishingTransaction(place, title, now);

    // Update the materialized view.
    // This assumes uniqueness of events, which is true so long as we're conflating these
    // API calls and the generation of events themselves.
    // We can't just use UPDATE here because we can't trust that `this.places` implies
    // presence in `mHistory` -- we also use it for bookmarks -- so UPDATE OR INSERT.
    const result = await this.db.run(`
      UPDATE mHistory
      SET lastVisited = ?, visitCount = visitCount + 1, lastTitle = ?
      WHERE place = ?`,
      [now, title, place]);

    if (result.changes === 0) {
      await this.db.run(`INSERT INTO mHistory
        (place, lastTitle, url, lastVisited, visitCount)
        VALUES (?, ?, ?, ?, ?)`,
        [place, title, url, now, 1]);
    }

    return place;
  }

  /**
   * Record a visit to a URL.
   * @param url the visited URL.
   * @param title (optional) a known title for the page.
   * @param now (optional) microsecond timestamp.
   * @returns {Promise} a promise that resolves to the place ID.
   */
  visit(url: string,
        session: number,
        title: ?string,
        now: number = microtime.now()): Promise<number> {
    return this.inTransaction(() =>
      this.recordVisitWithoutEstablishingTransaction(url, session, title, now)

          // If the transaction committed, keep the URL -> ID mapping in memory.
          .then((place) => this.savePlaceIDMapping(url, place)));
  }

  collectURLs(rows: [Object]): [string] {
    const out = [];
    for (const row of rows) {
      out.push(row.url);
    }
    return out;
  }

  async visitedMatches(substring: string,
                       since: number = 0,
                       limit: number = 10): Promise<[string]> {
    const like = `%${substring}%`;

    // Fetch all places visited, with the latest timestamp for each.
    // TODO: search historical titles?
    const query = `SELECT * FROM mHistory
      WHERE lastVisited > ? AND (
        lastTitle LIKE ? OR url LIKE ?
      )
      ORDER BY lastVisited DESC
      LIMIT ?
    `;

    return this.collectURLs(await this.db.all(query, [since, like, like, limit]));
  }

  // Ordered by last visit, descending.
  async visited(since: number = 0, limit: number = 10): Promise<[string]> {
    // Fetch all places visited, with the latest timestamp for each.
    const query = `SELECT * FROM mHistory
      WHERE lastVisited > ?
      ORDER BY lastVisited DESC
      LIMIT ?
    `;

    return this.collectURLs(await this.db.all(query, [since, limit]));
  }

  async starred(): Promise<[string]> {
    // Fetch all places visited, with the latest timestamp for each.
    const fromMaterialized = 'SELECT place, ts, url FROM mStarred';
    return this.collectURLs(await this.db.all(fromMaterialized));
  }

  userVersion(): Promise<number> {
    return this.db
               .get('PRAGMA user_version')
               .then((row) => Promise.resolve(row.user_version));
  }
}


// Associate URLs with persistent IDs.
// Note the use of AUTOINCREMENT to ensure that IDs are never reused after deletion.
const tablePlacesV4 = `CREATE TABLE placeEvents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  url TEXT UNIQUE NOT NULL,
  ts INTEGER NOT NULL
)`;

// Associate titles with places.
const tableTitlesV4 = `CREATE TABLE titleEvents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  place INTEGER NOT NULL REFERENCES placeEvents(id),
  ts INTEGER NOT NULL,
  title TEXT NOT NULL
)`;

// Associate visits with places.
const tableVisitsV4 = `CREATE TABLE visitEvents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  place INTEGER NOT NULL REFERENCES placeEvents(id),
  ts INTEGER NOT NULL,
  session INTEGER NOT NULL REFERENCES sessionStarts(id),
  type INTEGER NOT NULL
)`;

// Track the start of a session. Note that each session has a unique identifier, can
// be born of another (the ancestor), and can be within a scope (e.g., a window ID).
const tableSessionStartsV4 = `CREATE TABLE sessionStarts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  scope INTEGER,
  ancestor INTEGER REFERENCES sessionStarts(id),
  ts INTEGER NOT NULL
)`;

// Track the end of a session. Note that sessions must be started before they are
// ended.
const tableSessionEndsV4 = `CREATE TABLE sessionEnds (
  id INTEGER PRIMARY KEY REFERENCES sessionStarts(id),
  ts INTEGER NOT NULL
)`;

const tableStarsV4 = `CREATE TABLE starEvents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  place INTEGER NOT NULL REFERENCES placeEvents(id),
  session INTEGER NOT NULL REFERENCES sessionStarts(id),
  action TINYINT NOT NULL,
  ts INTEGER NOT NULL
)`;

const viewStarsV4 = `CREATE VIEW vStarred AS
SELECT place,
       MAX(starEvents.ts) AS ts,
       url FROM starEvents
JOIN placeEvents ON placeEvents.id = place
WHERE place IN (
  SELECT place FROM (
    SELECT place, ts, SUM(action) AS stars
    FROM starEvents
    GROUP BY place
  ) WHERE stars > 0
) AND action = 1
GROUP BY place
`;

const materializedStarsV4 = `CREATE TABLE mStarred (
  place INTEGER NOT NULL REFERENCES placeEvents(id),
  ts INTEGER NOT NULL,
  url TEXT NOT NULL
)`;

// We maximize on timestamp, not ID, but we can change our mind later.
const viewTitlesV4 = `CREATE VIEW vTitles AS
SELECT id AS titleID, MAX(ts) AS titleTS, place, title FROM titleEvents GROUP BY place
`;

const viewVisitsV4 = `CREATE VIEW vVisits AS
SELECT id AS visitID, MAX(ts) AS lastVisited, COUNT(id) AS visitCount, place
FROM visitEvents GROUP BY place
`;

const viewHistoryV4 = `CREATE VIEW vHistory AS
SELECT
  p.id AS place, p.url AS url,
  t.title AS lastTitle,
  v.lastVisited AS lastVisited, v.visitCount AS visitCount
FROM
vVisits AS v, vTitles AS t, placeEvents AS p
WHERE
 p.id = v.place AND
 p.id = t.place
ORDER BY lastVisited DESC
`;

const materializedHistoryV4 = `CREATE TABLE mHistory (
  place INTEGER NOT NULL REFERENCES placeEvents(id),
  url TEXT NOT NULL,
  lastTitle TEXT,
  lastVisited INTEGER NOT NULL,
  visitCount INTEGER NOT NULL
)`;

class ProfileStorageSchemaV4 {
  version: number;

  constructor() {
    this.version = 4;
  }

  /**
   * Take a newly opened ProfileStorage and make sure it reaches v4.
   * @param storage an open storage instance.
   */
  async createOrUpdate(storage): Promise<number> {
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

  async update(storage: ProfileStorage, from: number): Promise<number> {
    // Precondition: from < this.version.
    // Precondition: from > 0 (else we'd call `create`).
    switch (from) {
      case 1:
        await storage.db.run(tableTitlesV4);
        await storage.db.run(tableSessionStartsV4);
        await storage.db.run(tableSessionEndsV4);
        await storage.db.run(tableStarsV4);

        // Change the schema for visits. Lose existing ones.
        await storage.db.run('DROP TABLE visitEvents');
        await storage.db.run(tableVisitsV4);

        await storage.db.run(`PRAGMA user_version = ${this.version}`);
        break;

      case 2:

        // Tables.
        await storage.db.run(tableStarsV4);

        // We gave titles and visits IDs.
        await storage.db.run('DROP TABLE visitEvents');
        await storage.db.run('DROP TABLE titleEvents');
        await storage.db.run(tableVisitsV4);
        await storage.db.run(tableTitlesV4);

        // Views.
        await storage.db.run(viewStarsV4);
        await storage.db.run(viewVisitsV4);
        await storage.db.run(viewTitlesV4);
        await storage.db.run(viewHistoryV4);

        // Materialized views.
        await storage.db.run(materializedStarsV4);
        await storage.db.run(materializedHistoryV4);
        await storage.materializeStars();
        await storage.materializeHistory();

        await storage.db.run(`PRAGMA user_version = ${this.version}`);
        break;

      case 3:

        // No tables change in v3 -> v4: it's just adding a materialized view.
        // Views.
        await storage.db.run(viewStarsV4);
        await storage.db.run(viewVisitsV4);
        await storage.db.run(viewTitlesV4);
        await storage.db.run(viewHistoryV4);

        // Materialized views.
        await storage.db.run(materializedStarsV4);
        await storage.db.run(materializedHistoryV4);
        await storage.materializeStars();
        await storage.materializeHistory();

        await storage.db.run(`PRAGMA user_version = ${this.version}`);
        break;

      default:
        throw new Error('Can\'t upgrade from anything other than v1 or v2.');
    }

    return storage.userVersion();
  }

  async create(storage: ProfileStorage): Promise<number> {
    // Tables.
    await storage.db.run(tablePlacesV4);
    await storage.db.run(tableTitlesV4);
    await storage.db.run(tableVisitsV4);
    await storage.db.run(tableStarsV4);
    await storage.db.run(tableSessionStartsV4);
    await storage.db.run(tableSessionEndsV4);

    // Views.
    await storage.db.run(viewStarsV4);
    await storage.db.run(viewVisitsV4);
    await storage.db.run(viewTitlesV4);
    await storage.db.run(viewHistoryV4);

    // Materialized views.
    await storage.db.run(materializedStarsV4);
    await storage.db.run(materializedHistoryV4);
    await storage.materializeStars();
    await storage.materializeHistory();

    await storage.db.run(`PRAGMA user_version = ${this.version}`);

    return storage.userVersion();
  }
}
