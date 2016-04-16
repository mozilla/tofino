// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/* eslint no-console: 0 */

import 'babel-polyfill';
import 'babel-register';

import expect from 'expect';

import fs from 'fs';
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
      await storage.logUserVersion();
      await storage.close();

      console.log('Cleaning up.');

      // This should be the only file after we close.
      fs.unlinkSync(path.join(tempDir, 'browser.db'));
      fs.rmdirSync(tempDir);
      done();
    }());
  });
});
