// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/* eslint no-console: 0 */

import expect from 'expect';

import fs from 'fs';
import microtime from 'microtime-fast';
import path from 'path';
import tmp from 'tmp';

import { DB } from '../../app/services/sqlite';
import { ProfileStorage, VisitType } from '../../app/services/storage';

describe('DB.open', () => {
  it('Should create the DB file.', (done) => {
    (async function () {
      try {
        const tempPath = tmp.tmpNameSync();
        console.log(`Temporary DB is ${tempPath}.`);

        const db = await DB.open(tempPath);

        expect(db instanceof DB);
        fs.accessSync(tempPath);   // Throws on failure.

        const row = await db.get('PRAGMA user_version');
        expect(row.user_version === 0);
        await db.close();
        console.log('Cleaning up.');
        fs.unlinkSync(tempPath);   // Clean up.

        done();
      } catch (e) {
        done(e);
      }
    }());
  });
});

describe('ProfileStorage.open', () => {
  it('Should be accessible through the directory only, including creating dirs.', (done) => {
    (async function () {
      try {
        const parent = tmp.dirSync({}).name;
        console.log(`Temp root: ${parent}`);

        // Ensure that subdirectories will be created if necessary.
        const tempDir = path.join(parent, '/foo/bar/');
        const storage = await ProfileStorage.open(tempDir);

        expect(storage instanceof ProfileStorage);
        const v = await storage.userVersion();
        console.log(`Storage version: ${v}.`);
        await storage.close();

        console.log('Cleaning up.');

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
    console.log('Cleaning up.');

    // This should be the only file after we close.
    fs.unlinkSync(path.join(tempDir, 'browser.db'));
    fs.rmdirSync(tempDir);
  });

  it('Is created with the current version.', (done) => {
    (async function () {
      try {
        const storage = await ProfileStorage.open(tempDir);

        // You'll need to bump this every time the current version changes.
        const v = await storage.userVersion();
        expect(v === 2);

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
        expect(pE.foo === now);
        expect(vE.foo === 1);

        await storage.close();

        done();
      } catch (e) {
        done(e);
      }
    }());
  });

  it('Can save places across opens.', (done) => {
    (async function () {
      try {
        const storageA = await ProfileStorage.open(tempDir);

        const idFoo = await storageA.savePlace('http://example.com/foo');
        const idBar = await storageA.savePlace('http://example.com/bar');
        const again = await storageA.savePlace('http://example.com/foo');

        expect(idFoo === again);
        expect((idBar - idFoo) === 1);

        const fetched = await storageA.db.get('SELECT id FROM placeEvents WHERE url = ?', ['http://example.com/foo']);
        expect(fetched.id === idFoo);

        await storageA.close();

        // Reopen a new instance.
        const storageB = await ProfileStorage.open(tempDir);
        const idBarB = await storageB.savePlace('http://example.com/bar');

        // The ID is the same.
        expect(idBarB === idBar);

        const urlsA = await storageB.visited(0, 1);
        expect(urlsA.length === 1);
        const urlsB = await storageB.visited(0, 3);
        expect(urlsB.length === 2);

        await storageB.close();

        done();
      } catch (e) {
        done(e);
      }
    }());
  });

  it('Handles sessions with null and non-null values.', (done) => {
    (async function () {
      try {
        const storage = await ProfileStorage.open(tempDir);

        const sessionA = await storage.startSession(null, null);
        const sessionB = await storage.startSession(1, null);
        const sessionC = await storage.startSession(1, sessionB);
        const sessionD = await storage.startSession(null, sessionA);

        const rows = await storage.db.all(`
        SELECT id, scope, ancestor
        FROM sessionStarts
        ORDER BY id ASC
        `);

        expect(rows[0]).toEqual({ id: sessionA, scope: null, ancestor: null });
        expect(rows[1]).toEqual({ id: sessionB, scope: 1, ancestor: null });
        expect(rows[2]).toEqual({ id: sessionC, scope: 1, ancestor: sessionB });
        expect(rows[3]).toEqual({ id: sessionD, scope: null, ancestor: sessionA });

        await storage.close();

        done();
      } catch (e) {
        done(e);
      }
    }());
  });

  it('Saves visits.', (done) => {
    (async function () {
      try {
        const storage = await ProfileStorage.open(tempDir);

        const session = await storage.startSession(null, null);
        const idFoo = await storage.visit('http://example.com/foo', session);
        const idBar = await storage.visit('http://example.com/bar', session);
        const again = await storage.visit('http://example.com/foo', session);

        expect(idFoo === again);
        expect((idBar - idFoo) === 1);

        await storage.close();

        done();
      } catch (e) {
        done(e);
      }
    }());
  });

  it('Can query by URL match.', (done) => {
    (async function () {
      try {
        const storage = await ProfileStorage.open(tempDir);

        const session = await storage.startSession(null, null);
        await storage.visit('http://example.com/foo/noo', session);
        await storage.visit('http://example.com/barbaz/noo', session);
        await storage.visit('http://example.com/barbar', session);

        const results = await storage.visitedMatches('bar');
        expect(results.length === 2);
        expect(results[0] === 'http://example.com/barbar');
        expect(results[1] === 'http://example.com/barbaz/noo');

        await storage.close();

        done();
      } catch (e) {
        done(e);
      }
    }());
  });
});

describe('Schema upgrades', () => {
  it('Can upgrade from v1 to v2.', (done) => {
    (async function () {
      try {
        const tempPath = tmp.tmpNameSync();
        const db = await DB.open(tempPath);

        expect(db instanceof DB);
        expect((await db.get('PRAGMA user_version')).user_version === 0);

        // Make a v1 DB.
        const storage = new ProfileStorage(db);
        await new ProfileStorageSchemaV1().createOrUpdate(storage);
        expect((await db.get('PRAGMA user_version')).user_version === 1);

        // Upgrade it.
        await storage.init();
        expect((await db.get('PRAGMA user_version')).user_version === 2);

        await storage.close();
        console.log('Cleaning up.');
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
