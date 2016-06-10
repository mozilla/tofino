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

import Immutable from 'immutable';
import microtime from 'microtime-fast';
import { Bookmark } from '../../shared/model';

import { SessionEndReason, SessionStartReason, SnippetSize, StarOp, VisitType } from './storage';

import {
  datascript,
  mori,
  helpers,
} from 'datascript-mori';

const { hashMap, vector, parse, toJs, equals, isMap, hasKey, isSet, set, getIn, get } = mori;
const { DB_ADD } = helpers;

export class ProfileDatomStorage {
  constructor(dir) {
    this.dir = dir;
    const schema = this.createSchema();
    this.conn = datascript.core.create_conn(schema);
    this.schema = schema;
  }

  createSchema() {
    return helpers.schema_to_clj({
      'page/url': {
        ':db/cardinality': ':db.cardinality/one',
        ':db/unique': ':db.unique/identity',
        ':db/doc': 'A page\'s URL.',
        ':db.install/_attribute': ':db.part/db',
      },

      'page/title': {
        ':db/ident': ':page/title',
        ':db/cardinality': ':db.cardinality/one',      // We supersede as we see new titles.
        ':db/doc': 'A page\'s title.',
        ':db.install/_attribute': ':db.part/db',
      },

      'event/visit': {
        ':db/valueType': ':db.type/ref',
        ':db/cardinality': 'db.cardinality/many',
        ':db/doc': 'A visit to the page.',
      },

      // TODO: model sessions.
      'visit/instant': {
        ':db/cardinality': 'db.cardinality/one',
        ':db/doc': 'When the visit occurred.',
        ':db/index': true,
        // ':db/valueType': 'db.type/instant',        // Not supported by Datascript.
      },

      'session/startedFromAncestor': {
        ':db/valueType': 'db.type/ref',     // To a session.
        ':db/cardinality': 'db.cardinality/one',
        ':db/doc': 'The ancestor of a session.',
      },

      'session/startedInScope': {
        ':db/valueType': 'db.type/string',
        ':db/cardinality': 'db.cardinality/one',
        ':db/doc': 'The parent scope of a session.',
      },

      // Numeric for now.
      'session/startReason': {
        ':db/cardinality': 'db.cardinality/many',
        ':db/doc': 'The start reasons of a session.',
      },

      // Numeric for now.
      'session/endReason': {
        ':db/cardinality': 'db.cardinality/many',
        ':db/doc': 'The end reasons of a session.',
      },

      'session/startTime': {
        ':db/cardinality': 'db.cardinality/one',
      },
      'session/endTime': {
        ':db/cardinality': 'db.cardinality/one',
      },
    });
  }

  static async open(dir) {
    return new ProfileDatomStorage(dir);
  }

  close() {
    return true;
  }

  async startSession(scope, ancestor, now = microtime.now(), reason = SessionStartReason.newTab) {
    const result = datascript.core.transact_BANG_(this.conn, vector(
      vector(DB_ADD, -1, 'session/startedInScope', `${scope}`),
      vector(DB_ADD, -1, 'session/startedFromAncestor', ancestor),
      vector(DB_ADD, -1, 'session/startReason', reason),
      vector(DB_ADD, -1, 'session/startTime', now)
    ));

    return datascript.core.resolve_tempid(result.tempids, -1);
  }

  async endSession(session, now = microtime.now(), reason = SessionEndReason.tabClosed) {
    return datascript.core.transact_BANG_(this.conn, vector(
      vector(DB_ADD, session, 'session/endReason', reason),
      vector(DB_ADD, session, 'session/endTime', now)
    ));
  }

  // Chains through place ID.
  starPage(url, session, action, now = microtime.now()) {
    const result = datascript.core.transact_BANG_(this.conn, vector(
      vector(DB_ADD, -1, 'page/url', url),
    ));

    // TODO

    return datascript.core.resolve_tempid(result.tempids, -1);
  }

  /**
   * Record a visit to a URL.
   * @param url the visited URL.
   * @param title (optional) a known title for the page.
   * @param now (optional) microsecond timestamp.
   * @returns {Promise} a promise that resolves to the place ID.
   */
  visit(url, session, title, now = microtime.now()) {
    const result = datascript.core.transact_BANG_(this.conn, vector(
      vector(DB_ADD, -1, 'page/url', url),
      vector(DB_ADD, -1, 'page/title', title),    // TODO: handle no title.
      vector(DB_ADD, -1, 'event/visit', -2),
      vector(DB_ADD, -2, 'visit/instant', now),
    ));

    // TODO: session.

    return datascript.core.resolve_tempid(result.tempids, -1);
  }

  getVisits(since = null) {
    const db = datascript.core.db(this.conn);
    return datascript.core.index_range(db, 'visit/instant', since, null);
  }

  // Ordered by last visit, descending.
  async visited(since = null, limit = 10) {
    const visitDatoms = this.getVisits(since);

    // Note that the limit applies to *pages*, not *visits*, so we can't limit yet!
    const query = parse(`
    [:find ?ep, ?url, ?timestamp :in $ ?visits
     :where
     [(ground ?visits) [[?ev]]
     [?ev _ timestamp]
     [?ep :event/visit ?ev]
     [?ep :page/url ?u]]
    `);
  }

  someStuff() {
    datascript.core.transact_BANG_(this.conn, vector(
      vector(DB_ADD, -1, 'page/url', 'http://foo.com/'),
      vector(DB_ADD, -1, 'page/title', 'Foo.com')
    ));

    const query = parse(`
    [:find ?title :in $ ?url :where [?x "page/url" ?url] [?x "page/title" ?title]]
    `);
    var results = datascript.core.q(query, datascript.js.db(this.conn), 'http://foo.com/');
    console.log(results);

    datascript.core.transact_BANG_(this.conn, vector(
      vector(DB_ADD, -1, 'page/url', 'http://foo.com/'),
      vector(DB_ADD, -1, 'page/title', 'Foo.com Again')
    ));

    results = datascript.core.q(query, datascript.js.db(this.conn), 'http://foo.com/');
    console.log(results);
    return results;
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
  }

  async visitedMatches(substring, since = 0, limit = 10) {
  }

  // Ordered by last visit, descending.
  async visited(since = 0, limit = 10) {
  }

  async getStarredWithOrderByAndLimit(newestFirst, limit) {
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
  }
}
