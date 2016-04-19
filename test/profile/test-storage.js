// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/* eslint no-console: 0 */

import 'babel-polyfill';
import 'babel-register';

import expect from 'expect';

import fs from 'fs';
import microtime from 'microtime';
import path from 'path';
import tmp from 'tmp';

import { DB } from '../../app/services/sqlite';
import { ProfileStorage } from '../../app/services/storage';

describe('open', () => {
  it('Should create the DB file.', (done) => {
    (async function() {
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
    }());
  });

  it('Should be accessible through the directory only, including creating dirs.', (done) => {
    (async function() {
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
    }());
  });

  it('Is created with the current version.', (done) => {
    (async function() {
      const tempDir = tmp.dirSync({}).name;
      const storage = await ProfileStorage.open(tempDir);

      // You'll need to bump this every time the current version changes.
      const v = await storage.userVersion();
      expect(v === 1);

      // Make sure the tables exist.

      const now = microtime.now();
      await storage.db.run(`INSERT INTO placeEvents (id, url, ts) VALUES (1, \'http://example.com/\', ${now})`);
      await storage.db.run(`INSERT INTO visitEvents (place, ts) VALUES (1, ${now})`);
      const pE = await storage.db.get('SELECT ts FROM placeEvents');
      const vE = await storage.db.get('SELECT place FROM visitEvents');
      expect(pE.foo === now);
      expect(vE.foo === 1);

      await storage.close();

      console.log('Cleaning up.');

      // This should be the only file after we close.
      fs.unlinkSync(path.join(tempDir, 'browser.db'));
      fs.rmdirSync(tempDir);

      done();
    }());
  });

  it('Can save places across opens.', (done) => {
    (async function () {
      const tempDir = tmp.dirSync({}).name;
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
      expect(urlsA.length == 1);
      const urlsB = await storageB.visited(0, 3);
      expect(urlsB.length == 2);

      await storageB.close();

      console.log('Cleaning up.');

      // This should be the only file after we close.
      fs.unlinkSync(path.join(tempDir, 'browser.db'));
      fs.rmdirSync(tempDir);

      done();
    }());
  });
});
