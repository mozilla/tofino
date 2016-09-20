// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';

import fs from 'fs';
import Immutable from 'immutable';
import microtime from 'microtime-fast';
import path from 'path';
import tmp from 'tmp';
import { DB } from 'promise-sqlite';

import { VisitType } from '../../../app/services/user-agent-service/storage';
import { ProfileStorage } from '../../../app/services/user-agent-service/sqlstorage';

describe('Utility tests', () => {
  it('Compares sets correctly.', done => {
    expect(Immutable.Set(['a', 'b']).equals(Immutable.Set(['b', 'a']))).toBe(true);
    done();
  });
});

describe('DB.open', () => {
  it('Should create the DB file.', function(done) {
    (async function () {
      try {
        const tempPath = tmp.tmpNameSync();

        const db = await DB.open(tempPath);

        expect(db instanceof DB);
        fs.accessSync(tempPath);   // Throws on failure.

        const row = await db.get('PRAGMA user_version');
        expect(row.user_version).toBe(0);
        await db.close();
        fs.unlinkSync(tempPath);   // Clean up.

        done();
      } catch (e) {
        done(e);
      }
    }());
  });
});

describe('ProfileStorage.open', () => {
  it('Should be accessible through the directory only, including creating dirs.', done => {
    (async function () {
      try {
        const parent = tmp.dirSync({}).name;

        // Ensure that subdirectories will be created if necessary.
        const tempDir = path.join(parent, '/foo/bar/');
        const storage = await ProfileStorage.open(tempDir);

        expect(storage).toBeA(ProfileStorage);
        expect((await storage.userVersion())).toBe(5);
        await storage.close();

        // This should be the only file after we close.
        fs.unlinkSync(path.join(tempDir, 'browser.db'));
        fs.rmdirSync(tempDir);

        done();
      } catch (e) {
        done(e);
      }
    }());
  });
});

describe('ProfileStorage data access', () => {
  let tempDir = null;

  beforeEach(() => {
    tempDir = tmp.dirSync({}).name;
  });

  afterEach(() => {
    // This should be the only file after we close.
    fs.unlinkSync(path.join(tempDir, 'browser.db'));
    fs.rmdirSync(tempDir);
  });

  it('Is created with the current version.', done => {
    (async function () {
      try {
        const storage = await ProfileStorage.open(tempDir);

        // You'll need to bump this every time the current version changes.
        const v = await storage.userVersion();
        expect(v).toBe(5);

        // Make sure the tables exist.

        const now = microtime.now();
        await storage.db.run(`INSERT INTO placeEvents (id, url, ts) VALUES (1, \'http://example.com/\', ${now})`);
        await storage.db.run(`INSERT INTO sessionStarts (id, ts) VALUES (0, ${now})`);
        await storage.db.run(`INSERT INTO visitEvents
        (place, session, ts, type)
        VALUES
        (1, 0, ${now}, ${VisitType.unknown})`);

        const pE = await storage.db.get('SELECT ts FROM placeEvents');
        const vE = await storage.db.get('SELECT place FROM visitEvents');
        expect(pE.ts).toBe(now);
        expect(vE.place).toBe(1);

        await storage.close();

        done();
      } catch (e) {
        done(e);
      }
    }());
  });

  it('Can save places across opens.', done => {
    (async function () {
      try {
        const storageA = await ProfileStorage.open(tempDir);

        const idFoo = await storageA.savePlace('http://example.com/foo');
        const idBar = await storageA.savePlace('http://example.com/bar');
        const again = await storageA.savePlace('http://example.com/foo');

        expect(idFoo).toBe(again);
        expect((idBar - idFoo)).toBe(1);

        const fetched = await storageA.db.get('SELECT id FROM placeEvents WHERE url = ?',
                                              ['http://example.com/foo']);
        expect(fetched.id).toBe(idFoo);

        await storageA.close();

        // Reopen a new instance.
        const storageB = await ProfileStorage.open(tempDir);
        const idBarB = await storageB.savePlace('http://example.com/bar');

        // The ID is the same.
        expect(idBarB).toBe(idBar);

        // None of these places have actually been visited yet!
        expect((await storageB.visited(0))).toEqual([]);

        // Visit them.
        const session = await storageB.startSession();
        await storageB.visit('http://example.com/bar', session, 'Bar');
        await storageB.visit('http://example.com/baz', session, 'Baz');

        const urlsA = await storageB.visited(0, 1);
        expect(urlsA.map(r => r.url)).toEqual(['http://example.com/baz']);
        const urlsB = await storageB.visited(0, 3);
        expect(urlsB.map(r => r.url)).toEqual(['http://example.com/baz', 'http://example.com/bar']);

        // Check that we get the same results for from-scratch materialization.
        await storageB.rematerialize();
        expect((await storageB.visited(0, 3)).map(r => r.url))
          .toEqual(['http://example.com/baz', 'http://example.com/bar']);

        await storageB.close();

        done();
      } catch (e) {
        done(e);
      }
    }());
  });

  it('Handles sessions with null and non-null values.', done => {
    (async function () {
      try {
        const storage = await ProfileStorage.open(tempDir);

        const sessionA = await storage.startSession(null, null);
        const sessionB = await storage.startSession(1, null);
        const sessionC = await storage.startSession(1, sessionB);
        const sessionD = await storage.startSession(null, sessionA);

        const rows = await storage.db.all(`
        SELECT id, scope, ancestor, reason
        FROM sessionStarts
        ORDER BY id ASC
        `);

        expect(rows[0]).toEqual({ id: sessionA, scope: null, ancestor: null, reason: 0 });
        expect(rows[1]).toEqual({ id: sessionB, scope: 1, ancestor: null, reason: 0 });
        expect(rows[2]).toEqual({ id: sessionC, scope: 1, ancestor: sessionB, reason: 0 });
        expect(rows[3]).toEqual({ id: sessionD, scope: null, ancestor: sessionA, reason: 0 });

        await storage.endSession(sessionA);
        await storage.endSession(sessionC, 12345);

        const ends = await storage.db.all('SELECT id, ts, reason FROM sessionEnds ORDER BY id ASC');
        expect(ends[0].id).toEqual(sessionA);
        expect(ends[0].reason).toEqual(0);
        expect(ends[1].id).toEqual(sessionC);
        expect(ends[1].ts).toEqual(12345);
        expect(ends[1].reason).toEqual(0);

        await storage.close();

        done();
      } catch (e) {
        done(e);
      }
    }());
  });

  it('Saves visits.', done => {
    (async function () {
      try {
        const storage = await ProfileStorage.open(tempDir);

        const session = await storage.startSession(null, null);
        const idFoo = await storage.visit('http://example.com/foo', session, undefined);
        const idBar = await storage.visit('http://example.com/bar', session, 'Some title');
        const again = await storage.visit('http://example.com/foo', session);

        expect(idFoo).toBe(again);
        expect((idBar - idFoo)).toBe(1);

        // We only record non-undefined titles.
        expect((await storage.db
                             .all('SELECT title FROM titleEvents'))
          .map(row => row.title))
          .toEqual(['Some title']);

        await storage.close();

        done();
      } catch (e) {
        done(e);
      }
    }());
  });

  it('Stars pages.', done => {
    (async function () {
      try {
        const storage = await ProfileStorage.open(tempDir);

        const session = await storage.startSession(null, null);
        const place = await storage.starPage('http://example.com/foo/noo', session, 1);
        const again = await storage.starPage('http://example.com/foo/noo', session, -1);
        const yet = await storage.starPage('http://example.com/foo/noo', session, 1);

        expect(place).toBe(again);
        expect(place).toBe(yet);

        const visited = await storage.visit('http://example.com/foo/noo', session);

        expect(place).toBe(visited);

        await storage.close();

        done();
      } catch (e) {
        done(e);
      }
    }());
  });

  it('Can extract the set of starredURLs pages.', done => {
    (async function () {
      try {
        const storage = await ProfileStorage.open(tempDir);

        const bar = 'http://example.com/foo/bar';
        const baz = 'http://example.com/foo/baz';
        const both = Immutable.Set([bar, baz]);

        let starred: Immutable.Set<string>;
        const session = await storage.startSession(null, null);
        await storage.starPage(bar, session, 1);
        starred = await storage.starredURLs();
        expect(Immutable.Set([bar])).toEqual(starred);

        await storage.starPage(bar, session, -1);
        starred = await storage.starredURLs();
        expect(starred.isEmpty()).toBeTruthy();

        await storage.starPage(baz, session, 1);
        starred = await storage.starredURLs();
        expect(Immutable.Set([baz])).toEqual(starred);

        let recent = await storage.recentlyStarred(2);
        expect(recent.map(record => record.location)).toEqual([baz]);

        await storage.starPage('http://example.com/foo/bar', session, 1);

        starred = await storage.starredURLs();
        expect(both.equals(starred)).toBeTruthy();

        recent = await storage.recentlyStarred(2);
        expect(recent.map(record => record.location)).toEqual([bar, baz]);

        recent = await storage.recentlyStarred(1);
        expect(recent.map(record => record.location)).toEqual([bar]);

        // Check that we get the same results for from-scratch materialization.
        await storage.rematerialize();
        starred = await storage.starredURLs();
        expect(both.equals(starred)).toBeTruthy();

        await storage.close();

        done();
      } catch (e) {
        done(e);
      }
    }());
  });

  it('Can query by URL match.', done => {
    (async function () {
      try {
        const storage = await ProfileStorage.open(tempDir);

        const session = await storage.startSession(null, null);
        await storage.visit('http://example.com/foo/noo', session);
        await storage.visit('http://example.com/barbaz/noo', session);
        await storage.visit('http://example.com/barbar', session);

        const results = await storage.visitedMatches('bar');
        expect(results.length).toBe(2);
        expect(results[0]).toBe('http://example.com/barbar');
        expect(results[1]).toBe('http://example.com/barbaz/noo');

        await storage.close();

        done();
      } catch (e) {
        done(e);
      }
    }());
  });
});

describe('Schema upgrades', () => {
  it('Can upgrade from v1 to current.', done => {
    (async function () {
      try {
        const tempPath = tmp.tmpNameSync();
        const db = await DB.open(tempPath);

        expect(db).toBeA(DB);
        expect((await db.get('PRAGMA user_version')).user_version).toBe(0);

        // Make a v1 DB.
        const storage = new ProfileStorage(db);
        await new ProfileStorageSchemaV1().createOrUpdate(storage);
        expect((await db.get('PRAGMA user_version')).user_version).toBe(1);

        // Upgrade it.
        await storage.init();
        expect((await db.get('PRAGMA user_version')).user_version).toBe(5);

        await storage.close();
        fs.unlinkSync(tempPath);   // Clean up.

        done();
      } catch (e) {
        done(e);
      }
    }());
  });

  it('Can upgrade from v2 to current.', done => {
    (async function () {
      try {
        const tempPath = tmp.tmpNameSync();
        const db = await DB.open(tempPath);

        expect(db).toBeA(DB);
        expect((await db.get('PRAGMA user_version')).user_version).toBe(0);

        // Make a v2 DB.
        const storage = new ProfileStorage(db);
        await new ProfileStorageSchemaV2().createOrUpdate(storage);
        expect((await db.get('PRAGMA user_version')).user_version).toBe(2);

        // Upgrade it.
        await storage.init();
        expect((await db.get('PRAGMA user_version')).user_version).toBe(5);

        await storage.close();
        fs.unlinkSync(tempPath);   // Clean up.

        done();
      } catch (e) {
        done(e);
      }
    }());
  });

  it('Can upgrade from v4 to current  .', done => {
    (async function () {
      try {
        const tempPath = tmp.tmpNameSync();
        const db = await DB.open(tempPath);

        expect(db).toBeA(DB);
        expect((await db.get('PRAGMA user_version')).user_version).toBe(0);

        // Make a v4 DB.
        const storage = new ProfileStorage(db);
        await new ProfileStorageSchemaV4().createOrUpdate(storage);
        expect((await db.get('PRAGMA user_version')).user_version).toBe(4);

        // Upgrade it.
        await storage.init();
        expect((await db.get('PRAGMA user_version')).user_version).toBe(5);

        await storage.close();
        fs.unlinkSync(tempPath);   // Clean up.

        done();
      } catch (e) {
        done(e);
      }
    }());
  });
});


// Historical schema versions.

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
      return v;
    }

    switch (v) {
      case 0:
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


// Associate URLs with persistent IDs.
// Note the use of AUTOINCREMENT to ensure that IDs are never reused after deletion.
const tablePlacesV2 = `CREATE TABLE placeEvents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  url TEXT UNIQUE NOT NULL,
  ts INTEGER NOT NULL
)`;

// Associate titles with places.
const tableTitlesV2 = `CREATE TABLE titleEvents (
  place INTEGER NOT NULL REFERENCES placeEvents(id),
  ts INTEGER NOT NULL,
  title TEXT NOT NULL
)`;

// Associate visits with places.
const tableVisitsV2 = `CREATE TABLE visitEvents (
  place INTEGER NOT NULL REFERENCES placeEvents(id),
  ts INTEGER NOT NULL,
  session INTEGER NOT NULL REFERENCES sessionStarts(id),
  type INTEGER NOT NULL
)`;

// Track the start of a session. Note that each session has a unique identifier, can
// be born of another (the ancestor), and can be within a scope (e.g., a window ID).
const tableSessionStartsV2 = `CREATE TABLE sessionStarts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  scope INTEGER,
  ancestor INTEGER REFERENCES sessionStarts(id),
  ts INTEGER NOT NULL
)`;

// Track the end of a session. Note that sessions must be started before they are
// ended.
const tableSessionEndsV2 = `CREATE TABLE sessionEnds (
  id INTEGER PRIMARY KEY REFERENCES sessionStarts(id),
  ts INTEGER NOT NULL
)`;

class ProfileStorageSchemaV2 {
  constructor() {
    this.version = 2;
  }

  /**
   * Take a newly opened ProfileStorage and make sure it reaches v2.
   * @param storage an open storage instance.
   */
  async createOrUpdate(storage) {
    const v = await storage.userVersion();

    if (v === this.version) {
      return v;
    }

    if (v === 0) {
      return this.create(storage);
    }

    if (v < this.version) {
      return this.update(storage, v);
    }

    throw new Error(`Target version ${this.version} lower than DB version ${v}!`);
  }

  async update(storage, from) {
    // Precondition: from < this.version.
    // Precondition: from > 0 (else we'd call `create`).
    if (from !== 1) {
      throw new Error('Can\'t upgrade from anything other than v1.');
    }

    await storage.db.run(tableTitlesV2);
    await storage.db.run(tableSessionStartsV2);
    await storage.db.run(tableSessionEndsV2);

    // Change the schema for visits. Lose existing ones.
    await storage.db.run('DROP TABLE visitEvents');
    await storage.db.run(tableVisitsV2);

    await storage.db.run('PRAGMA user_version = 2');

    return storage.userVersion();
  }

  async create(storage) {
    await storage.db.run(tablePlacesV2);
    await storage.db.run(tableTitlesV2);
    await storage.db.run(tableVisitsV2);
    await storage.db.run(tableSessionStartsV2);
    await storage.db.run(tableSessionEndsV2);
    await storage.db.run('PRAGMA user_version = 2');

    return storage.userVersion();
  }
}

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
  place INTEGER NOT NULL UNIQUE REFERENCES placeEvents(id),
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
  async createOrUpdate(storage: ProfileStorage): Promise<number> {
    const v = await storage.userVersion();

    if (v === this.version) {
      return v;
    }

    if (v === 0) {
      return this.create(storage);
    }

    if (v < this.version) {
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
        throw new Error('Can\'t upgrade from anything other than v1-v3.');
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
