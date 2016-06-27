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

/**
 * The storage module that makes up the majority of the profile service.
 * @module ProfileStorage
 */

import Immutable from 'immutable';
import fs from 'fs-promise';
import microtime from 'microtime-fast';
import path from 'path';
import escaper from 'true-html-escape';

import { Bookmark } from '../../shared/model';
import { ProfileStorageSchemaV5 } from './profile-schema';
import { DB, verbose } from './sqlite';
import { SessionEndReason, SessionStartReason, SnippetSize, StarOp, VisitType } from './storage';

/**
 * Public API:
 *
 *   let storage = await ProfileStorage.open(dir);
 *   let session = await storage.startSession(scope, ancestor, reason);
 *   await storage.visit(url, session, microseconds);
 *   await storage.endSession(session, microseconds, reason);
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

    await fs.mkdirp(dir);
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

  async init(schema = new ProfileStorageSchemaV5()) {
    await this.db.exec('PRAGMA foreign_keys = ON');
    const v = await schema.createOrUpdate(this);

    if (v !== schema.version) {
      throw new Error(`Incorrect version ${v}; expected ${schema.version}.`);
    }

    await this.loadPlaces();

    return this;
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
  async savePlaceWithoutEstablishingTransaction(url, now) {
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

  savePlace(url, now = microtime.now()) {
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
  saveTitleForPlaceWithoutEstablishingTransaction(place, title,
                                                  now = microtime.now()) {
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

  async startSession(scope, ancestor, now = microtime.now(), reason = SessionStartReason.newTab) {
    const result =
      await this.db
                .run('INSERT INTO sessionStarts (scope, ancestor, ts, reason) VALUES (?, ?, ?, ?)',
                  [scope, ancestor, now, reason]);
    return result.lastID;
  }

  async endSession(session, now = microtime.now(), reason = SessionEndReason.tabClosed) {
    const result =
      await this.db
                .run('INSERT INTO sessionEnds (id, ts, reason) VALUES (?, ?, ?)',
                  [session, now, reason]);
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
  updateMaterializedStars(url, place, session, action, now = microtime.now()) {
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
  starPage(url, session, action, now = microtime.now()) {
    if (action !== StarOp.star && action !== StarOp.unstar) {
      return Promise.reject(new Error(`Unknown action ${action}.`));
    }

    const star = (place) =>
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

    return this.db.inTransaction(() =>
                 this.savePlaceWithoutEstablishingTransaction(url, now)
                     .then(star))

               // If the transaction committed, keep the URL -> ID mapping in memory.
               .then((id) => this.savePlaceIDMapping(url, id));
  }

  async recordVisitWithoutEstablishingTransaction(url, session, title, now = microtime.now()) {
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
  visit(url, session, title, now = microtime.now()) {
    return this.db.inTransaction(() =>
      this.recordVisitWithoutEstablishingTransaction(url, session, title, now)

          // If the transaction committed, keep the URL -> ID mapping in memory.
          .then((place) => this.savePlaceIDMapping(url, place)));
  }

  collectURLs(rows) {
    const out = [];
    for (const row of rows) {
      out.push(row.url);
    }
    return out;
  }

  /**
   * Search for places that match title, URL, or saved content
   * since the specified timestamp.
   *
   * Snippets in the returned results are guaranteed to be HTML-escaped.
   * They will include `<b>` `</b>` tags around matches.
   *
   * @param string The substring to match. Not tokenized.
   * @param since The earliest visit time in microseconds.
   * @param limit The maximum number of results to return.
   * @returns {Promise<[AwesomebarMatch]>}
   */
  async query(string, since = 0, limit = 10, snippetSize = SnippetSize.medium) {
    const contentMatches = `
    SELECT p.id AS place,
           p.url AS uri,
           pages.title AS title,
           snippet(pages, '╞', '╡', '…', -1, ?) AS snippet,
           pages.ts AS lastVisited
    FROM placeEvents AS p JOIN pages ON p.id = pages.place
    WHERE pages.ts > ? AND pages MATCH ?
    `;

    const visitMatches = `
    SELECT place,
           url AS uri,
           lastTitle AS title,
           NULL AS snippet,
           lastVisited
    FROM mHistory
    WHERE lastVisited > ? AND (
      lastTitle LIKE ? OR url LIKE ?
    )`;

    const query = `
    SELECT place,
           uri,
           MAX(title) AS title,
           MAX(snippet) AS snippet,
           MAX(lastVisited) AS lastVisited
    FROM (${contentMatches} UNION ${visitMatches})
    GROUP BY place
    ORDER BY lastVisited DESC
    LIMIT ?`;

    const like = `%${string}%`;
    const rows = await this.db.all(query, [snippetSize, since, string, since, like, like, limit]);

    // We escape on the way out, not the way in, for two reasons:
    // 1. We can't rely on the retrieved content correctly including the entirety of an escaped
    //    character like '&amp;'.
    // 2. We'd like to be able to match on the unescaped text.
    function escape(s) {
      if (!s) {
        return s;
      }

      return escaper.escape(s)
                    .replace(/╞/g, '<b>')
                    .replace(/╡/g, '</b>');
    }

    rows.forEach(row => {
      row.snippet = escape(row.snippet);
    });
    return rows;
  }

  async visitedMatches(substring, since = 0, limit = 10) {
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
  async visited(since = 0, limit = 10) {
    // Fetch all places visited, with the latest timestamp for each.
    const query = `
      SELECT h.place AS place,
             h.url AS uri,
             h.lastTitle AS title,
             pages.excerpt AS snippet,
             h.lastVisited AS lastVisited
      FROM mHistory AS h LEFT JOIN pages ON pages.place = h.place
      WHERE h.lastVisited > ?
      GROUP BY h.place
      ORDER BY h.lastVisited DESC
      LIMIT ?
    `;

    return await this.db.all(query, [since, limit]);
  }

  async getStarredWithOrderByAndLimit(newestFirst, limit) {
    const orderClause = newestFirst ? 'ORDER BY s.ts DESC' : '';
    let limitClause;
    let args;
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

  async starredURLs(limit = undefined) {
    // Fetch all places visited, with the latest timestamp for each.
    const rows = await this.getStarredWithOrderByAndLimit(false, limit);
    return Immutable.Set(rows.map(row => row.url));
  }

  async recentlyStarred(limit = 5) {
    const rows = await this.getStarredWithOrderByAndLimit(true, limit);
    return rows.map(row =>
      new Bookmark({
        title: row.title, location: row.url, visitedAt: row.ts,
      }));
  }

  async savePage(page, session, now = microtime.now()) {
    const place = await this.savePlace(page.uri, now);
    const query = `
    INSERT INTO pages (place, session, ts, title, excerpt, content)
    VALUES (?, ?, ?, ?, ?, ?)
    `;
    return this.db.run(query, [place, session, now, page.title, page.excerpt, page.textContent]);
  }

  userVersion() {
    return this.db
               .get('PRAGMA user_version')
               .then((row) => Promise.resolve(row.user_version));
  }
}
