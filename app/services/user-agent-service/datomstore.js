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

// We're not done building yet.
/* eslint-disable no-unused-vars */
/* eslint-disable no-empty-function */

import {
  datascript,
  mori,
  helpers,
} from 'datascript-mori';

import Immutable from 'immutable';
import microtime from 'microtime-fast';
import { Bookmark } from '../../shared/model';

import {
  SessionEndReason,
  SessionStartReason,
  SnippetSize,
  StarOp,
  // VisitType
} from './storage';

const { lazySeq, vector, parse, getIn } = mori;
const { DB_ADD, DB_RETRACT, DB_CURRENT_TX, TEMPIDS } = helpers;

const profileSchema = {
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
    ':db/cardinality': ':db.cardinality/many',
    ':db/doc': 'A visit to the page.',
  },

  'page/starred': {
    ':db/cardinality': ':db.cardinality/one',
    ':db/doc': 'A starring of the page.',
  },

  // TODO: model sessions.
  'visit/instant': {
    ':db/cardinality': ':db.cardinality/one',
    ':db/doc': 'When the visit occurred.',
    ':db/index': true,
    // ':db/valueType': 'db.type/instant',        // Not supported by Datascript.
  },

  'session/startedFromAncestor': {
    ':db/valueType': ':db.type/ref',     // To a session.
    ':db/cardinality': ':db.cardinality/one',
    ':db/doc': 'The ancestor of a session.',
  },

  'session/startedInScope': {
    // ':db/valueType': ':db.type/string',        // Not supported by Datascript.
    ':db/cardinality': ':db.cardinality/one',
    ':db/doc': 'The parent scope of a session.',
  },

  // Numeric for now.
  'session/startReason': {
    ':db/cardinality': ':db.cardinality/many',
    ':db/doc': 'The start reasons of a session.',
  },

  // Numeric for now.
  'session/endReason': {
    ':db/cardinality': ':db.cardinality/many',
    ':db/doc': 'The end reasons of a session.',
  },

  'session/startTime': {
    ':db/cardinality': ':db.cardinality/one',
  },

  'session/endTime': {
    ':db/cardinality': ':db.cardinality/one',
  },
};

// mapcat is lazy, but it always needs to evaluate the first few elements
// of its input collection in order to concat. This version does not.
function lazyMapcat(f, coll) {
  if (mori.isEmpty(coll)) {
    return coll;
  }

  return lazySeq(() => mori.concat(f(mori.first(coll)),
    lazyMapcat(f, mori.rest(coll))));
}

function compareDescending(a, b) {
  return b - a;
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export class ProfileDatomStorage {
  constructor(dir) {
    this.dir = dir;
    const schema = this.createSchema();
    this.conn = datascript.core.create_conn(schema);
    this.schema = schema;

    this.pageDetailsQuery = parse(`
    [:find (max ?timestamp) (pull ?page ["page/url" "page/title"]) ?page
     :in $ ?visits
     :where
     [(ground ?visits) [[?ev]]]
     [?page "event/visit" ?ev]
     [?ev _ ?timestamp]]
    `);
  }

  createSchema() {
    return helpers.schema_to_clj(profileSchema);
  }

  static async open(dir) {
    return new ProfileDatomStorage(dir);
  }

  close() {
    return true;
  }

  getDB() {
    return datascript.core.db(this.conn);
  }

  transact(assertions) {
    return datascript.core.transact_BANG_(this.conn, assertions);
  }

  async startSession(scope, ancestor, now = microtime.now(), reason = SessionStartReason.newTab) {
    let assertions = vector(
      vector(DB_ADD, -1, 'session/startedInScope', `${scope}`),
      vector(DB_ADD, -1, 'session/startReason', reason),
      vector(DB_ADD, -1, 'session/startTime', now)
    );

    if (ancestor) {
      assertions = mori.conj(assertions,
        vector(DB_ADD, -1, 'session/startedFromAncestor', ancestor)
      );
    }

    const result = this.transact(assertions);
    return getIn(result, [TEMPIDS, -1]);
  }

  async endSession(session, now = microtime.now(), reason = SessionEndReason.tabClosed) {
    return this.transact(vector(
      vector(DB_ADD, session, 'session/endReason', reason),
      vector(DB_ADD, session, 'session/endTime', now)
    ));
  }

  // Chains through place ID.
  // Unlike Datomic, we use microseconds for transaction timestamps.
  async starPage(url, session, action, now = microtime.now()) {
    if (action === StarOp.star) {
      // TODO: session.
      const result = this.transact(vector(
        vector(DB_ADD, DB_CURRENT_TX, ':db/txInstant', now),
        vector(DB_ADD, -1, 'page/url', url),
        vector(DB_ADD, -1, 'page/starred', true)
      ));
      return getIn(result, [TEMPIDS, -1]);
    }

    if (action === StarOp.unstar) {
      // TODO: session.
      const result = this.transact(vector(
        vector(DB_ADD, DB_CURRENT_TX, ':db/txInstant', now),
        vector(DB_RETRACT, vector('page/url', url), 'page/starred', true)
      ));
      return undefined;         // TODO?
    }

    return Promise.reject(new Error(`Unknown action ${action}.`));
  }

  /**
   * Record a visit to a URL.
   * @param url the visited URL.
   * @param title (optional) a known title for the page.
   * @param now (optional) microsecond timestamp.
   * @returns {Promise} a promise that resolves to the place ID.
   */
  visit(url, session, title, now = microtime.now()) {
    let assertions = vector(
      vector(DB_ADD, -1, 'page/url', url),
      vector(DB_ADD, -1, 'event/visit', -2),
      vector(DB_ADD, -2, 'visit/instant', now)
    );

    if (title) {
      assertions = mori.conj(assertions,
        vector(DB_ADD, -1, 'page/title', title)
      );
    }

    const result = this.transact(assertions);

    // TODO: session.

    return getIn(result, [TEMPIDS, -1]);
  }

  getVisits(since = null) {
    return mori.reverse(
      datascript.core.index_range(
        this.getDB(), 'visit/instant', since, null));
  }

  pageResultToJSON(tuple) {
    const [ts, details, page] = tuple;
    return {
      lastVisited: ts,
      place: page,
      uri: mori.get(details, 'page/url'),
      title: mori.get(details, 'page/title'),
    };
  }

  getPageDetails(visits) {
    const query = this.pageDetailsQuery;
    const results = datascript.core.q(query, this.getDB(), visits);
    const sorted = mori.sortBy(mori.first, compareDescending, results);
    return mori.map(this.pageResultToJSON, sorted);
  }

  async getVisitedPagesEagerly(visitDatoms) {
    return this.getPageDetails(visitDatoms);
  }

  async getVisitedPagesLazily(visitDatoms, chunkSize) {
    const expandResults = this.getPageDetails.bind(this);

    // We want to find `limit` unique URLs, regardless of how many
    // visits we need to consume from the potentially huge sequence of
    // visits. We lazily chunk the visit seq, and walk it running queries
    // until we have enough.
    const chunks = mori.partitionAll(chunkSize, visitDatoms);
    return lazyMapcat(expandResults, chunks);
  }

  async visitedMatchingFilter(visitDatoms, filter, limit = 10, filterRate = 3) {
    // Fast path: we don't need chunking or laziness, because there are
    // fewer than `limit` total visits.
    const count = mori.count(visitDatoms);
    if (!limit || (count < limit)) {
      const all = await this.getVisitedPagesEagerly(visitDatoms);
      return mori.filter(filter, all);
    }

    const all = await this.getVisitedPagesLazily(visitDatoms, filterRate * limit);
    return mori.take(limit, mori.filter(filter, all));
  }

  /**
   * Produce a predicate that allows a result to pass only once.
   */
  uniquenessFilter() {
    const seen = new Set();
    return page => {
      if (seen.has(page.place)) {
        return false;
      }
      seen.add(page.place);
      return true;
    };
  }

  matchesFilter(input) {
    const re = new RegExp(escapeRegExp(input), 'i');
    return result => (result.title && re.test(result.title)) ||
                     (re.test(result.uri));
  }

  // Ordered by last visit, descending.
  async visited(since = null, limit = 10) {
    const visitDatoms = this.getVisits(since);

    // Fast path: we don't need chunking or laziness, because there are
    // fewer than `limit` total visits.
    const count = mori.count(visitDatoms);
    if (!limit || (count < limit)) {
      return this.getVisitedPagesEagerly(visitDatoms);
    }

    return this.visitedMatchingFilter(visitDatoms, this.uniquenessFilter(), limit);
  }

  // Future: free-text indexing.
  // Future: consider whether to do text lookup on URLs first (perhaps through an
  // auxiliary data structure) rather than filtering visits.
  // For lots of matches and a small limit, filtering might well be faster, but…
  async visitedMatches(substring, since = 0, limit = 10) {
    const visitDatoms = this.getVisits(since);

    if (substring === '') {
      return this.visited(since, limit);
    }

    const unique = this.uniquenessFilter();
    const matches = this.matchesFilter(substring);
    const keep = page => unique(page) && matches(page);

    return this.visitedMatchingFilter(visitDatoms, keep, limit);
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
    // TODO
  }

  async getStarredWithOrderByAndLimit(newestFirst, limit) {
    const starredQuery = parse(`
    [:find (max ?timestampMicros) (pull ?page ["page/url" "page/title"]) ?page
     :in $
     :where
     [?page "page/starred" true ?t]
     [?t ":db/txInstant" ?timestampMicros]
    ]`);
    const results = datascript.core.q(starredQuery, this.getDB());
    const sorted = newestFirst ? mori.sortBy(mori.first, compareDescending, results) : results;
    const limited = limit ? mori.take(limit, sorted) : sorted;
    return mori.map(this.pageResultToJSON, limited);
  }

  async starredURLs(limit = undefined) {
    const rows = await this.getStarredWithOrderByAndLimit(false, limit);
    return mori.set(mori.map(row => row.uri, rows));
  }

  async recentlyStarred(limit = 5) {
    const rows = await this.getStarredWithOrderByAndLimit(true, limit);
    return mori.map(row =>
      new Bookmark({
        title: row.title, location: row.uri, visitedAt: row.lastVisited,
      }), rows);
  }

  async savePage(page, session, now = microtime.now()) {
    // TODO
  }
}
