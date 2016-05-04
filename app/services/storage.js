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

import Immutable from 'immutable';
import cbmkdirp from 'less-mkdirp';
import microtime from 'microtime-fast';
import path from 'path';
import thenify from 'thenify';

import { Bookmark } from '../model/index';
import { ProfileStorageSchemaV4 } from './profile-schema';
import { DB, verbose } from './sqlite';

const mkdirp = thenify(cbmkdirp);

type BookmarkRow = { place: number, title: ?string, ts: number, url: string };

interface ProfileSchema {
  version: number;
  createOrUpdate(storage: ProfileStorage): Promise<number>;
}

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

  async init(schema: ProfileSchema = new ProfileStorageSchemaV4()): Promise<ProfileStorage> {
    await this.db.exec('PRAGMA foreign_keys = ON');
    const v = await schema.createOrUpdate(this);

    if (v !== schema.version) {
      throw new Error(`Incorrect version ${v}; expected ${schema.version}.`);
    }

    await this.loadPlaces();

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

  async materializeStars(): Promise<any> {
    await this.db.run('DELETE FROM mStarred');
    await this.db.run('INSERT INTO mStarred SELECT place, ts, url FROM vStarred');
  }

  async materializeHistory(): Promise<any> {
    await this.db.run('DELETE FROM mHistory');
    await this.db.run(`INSERT INTO mHistory
      SELECT place, url, lastTitle, lastVisited, visitCount
      FROM vHistory
    `);
  }

  async rematerialize(): Promise<any> {
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
                          now: number = microtime.now()): Promise<any> {
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

  async getStarredWithOrderByAndLimit(newestFirst: boolean, limit: ?number):
  Promise<[BookmarkRow]> {
    const orderClause = newestFirst ? 'ORDER BY s.ts DESC' : '';
    let limitClause: string;
    let args: [any];
    if (limit) {
      limitClause = 'LIMIT ?';
      args = [limit];
    } else {
      limitClause = '';
      args = [];
    }

    const fromMaterialized = `
    SELECT s.place AS place, t.title AS title, s.ts AS ts, s.url AS url
    FROM mStarred AS s LEFT JOIN vTitles AS t ON s.place = t.place
    ${orderClause} ${limitClause}
    `;

    return await this.db.all(fromMaterialized, args);
  }

  async starredURLs(limit: ?number = undefined): Promise<Immutable.Set<string>> {
    // Fetch all places visited, with the latest timestamp for each.
    const rows: [BookmarkRow] = await this.getStarredWithOrderByAndLimit(false, limit);
    return Immutable.Set(rows.map(row => row.url));
  }

  async recentlyStarred(limit: number = 5): Promise<[Bookmark]> {
    const rows: [BookmarkRow] = await this.getStarredWithOrderByAndLimit(true, limit);
    return rows.map(row =>
      new Bookmark({
        title: row.title, location: row.url, visitedAt: row.ts,
      }));
  }

  userVersion(): Promise<number> {
    return this.db
               .get('PRAGMA user_version')
               .then((row) => Promise.resolve(row.user_version));
  }
}

