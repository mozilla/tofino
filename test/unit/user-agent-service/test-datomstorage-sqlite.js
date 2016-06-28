// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';

import fs from 'fs-promise';
import path from 'path';
import tmp from 'tmp';

import {
  datascript,
  helpers,
  mori,
} from 'datascript-mori';

import * as microtime from 'microtime-fast';

import { ProfileDatomStorage } from '../../../app/services/user-agent-service/datomstore';
import { DatomStorageSqlite } from '../../../app/services/user-agent-service/datomstorage-sqlite';
import { DB } from '../../../app/services/user-agent-service/sqlite';

const { vector } = mori;
const { DB_ADD, DB_RETRACT, TEMPIDS } = helpers;

const djs = datascript.js;

const TEST_DATOMS_PATH = path.join(__dirname, 'test-datoms.db');

describe('DatomStorageSQLite', function() {
  it('Should write transactions.', function(done) {
    (async function () {
      try {
        const tempDir = tmp.tmpNameSync();
        const datomStorage = await ProfileDatomStorage.open(tempDir);

        // Just for testing.
        const db = datomStorage.persistentStorage.db;

        const transactionCount = async function() {
          const rows = await db.all('SELECT DISTINCT(tx) FROM transactions');
          return rows.length;
        };

        const transactionRowCount = async function() {
          const rows = await db.all('SELECT tx FROM transactions');
          return rows.length;
        };

        try {
          const conn = datomStorage.conn;

          // Initially, we have 0 datoms.
          expect(mori.count(djs.db(conn))).toBe(0);
          expect(await transactionCount()).toBe(0);
          expect(await transactionRowCount()).toBe(0);

          const now = microtime.now();
          const report = await datomStorage.transact(vector(
            vector(DB_ADD, -1, 'session/startTime1', now),
            vector(DB_ADD, -1, 'session/startTime2', now)
          ));

          // 2 datoms, 1 transaction, 2 transaction rows.
          expect(mori.count(djs.db(conn))).toBe(2);
          expect(await transactionCount()).toBe(1);
          expect(await transactionRowCount()).toBe(2);

          await datomStorage.transact(vector(
            vector(DB_RETRACT, mori.getIn(report, [TEMPIDS, -1]), 'session/startTime1', now)));

          // 1 datom, 2 transactions, 3 transaction rows.
          expect(mori.count(djs.db(conn))).toBe(1);
          expect(await transactionCount()).toBe(2);
          expect(await transactionRowCount()).toBe(3);

          done();
        } finally {
          datomStorage.close();
          // This should be the only file after we close.
          fs.unlinkSync(path.join(tempDir, 'datoms.db'));
          fs.rmdirSync(tempDir);
        }
      } catch (e) {
        done(e);
      }
    }());
  });

  it('Should read snapshots, replay transactions, and replace snapshots.', function(done) {
    (async function () {
      try {
        const tempDir = tmp.tmpNameSync();
        await fs.mkdirp(tempDir);
        await fs.copy(TEST_DATOMS_PATH, path.join(tempDir, 'datoms.db'));
        const persistentDB = await DB.open(path.join(tempDir, 'datoms.db'));
        const persistentStorage = new DatomStorageSqlite(persistentDB);
        persistentStorage.init();

        try {
          // Initial snapshot has 0 datoms.
          const db = await persistentStorage.dbFromSnapshot();
          expect(mori.count(db)).toBe(0);

          // Playing just the first transaction back adds 2 datoms.
          const conn = djs.conn_from_db(db);
          await persistentStorage.replayTransactions(conn, 0, 0x20000011);
          expect(mori.count(djs.db(conn))).toBe(2);

          // Playing the second transaction back retracts 1 datom.
          await persistentStorage.replayTransactions(conn, 0x20000012);
          expect(mori.count(djs.db(conn))).toBe(1);

          // Saving and reading a new snapshot yields 1 datom.
          await persistentStorage.replaceSnapshot(djs.db(conn));
          const updatedDB = await persistentStorage.dbFromSnapshot();
          expect(mori.count(updatedDB)).toBe(1);

          // We replayed two transactions.  It's important to note that transactions usually
          // start from 0x20000000 and these are larger; that's because the tx IDs written to
          // the file are intentionally larger, showing that the replayed transactions remember
          // their stored tx IDs, rather than getting assigned new local tx IDs.
          expect(mori.every(mori.map((x) => mori.get(x, 'tx') >= 0x20000010, updatedDB)))
            .toBe(true);

          done();
        } finally {
          persistentStorage.close();
          // This should be the only file after we close.
          fs.unlinkSync(path.join(tempDir, 'datoms.db'));
          fs.rmdirSync(tempDir);
        }
      } catch (e) {
        done(e);
      }
    }());
  });
});
