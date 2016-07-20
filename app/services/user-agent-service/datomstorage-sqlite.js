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


import {
  datascript,
  mori,
  helpers,
} from 'datascript-mori';

import * as datomstore from './datomstore';
import { DatomStorageSchemaV1 } from './datomstorage-schema';

const { vector } = mori;
const { DB_ADD, DB_RETRACT } = helpers;

const d = datascript.core;
const djs = datascript.js;

export class DatomStorageSqlite {
  constructor(db) {
    this.db = db;
  }

  async init(sqlSchema = new DatomStorageSchemaV1()) {
    await this.db.exec('PRAGMA foreign_keys = ON');
    const v = await sqlSchema.createOrUpdate(this);

    if (v !== sqlSchema.version) {
      throw new Error(`Incorrect version ${v}; expected ${sqlSchema.version}.`);
    }
  }

  async close() {
    this.db.close();
    return true;
  }

  async userVersion() {
    return await this.db
      .get('PRAGMA user_version')
      .then((row) => Promise.resolve(row.user_version));
  }

  async listen(report) {
    const transactionToRow = (tx) => {
      return mori.vector(tx.e,
                         tx.a,
                         tx.v,
                         tx.tx,
                         tx.added ? 1 : 0);
    };


    const txData = mori.get(report, mori.keyword('tx-data'));

    await this.db.inTransaction(() => {
      // Write 150 5-tuples at a time.  SQLite has a limit of 999 bound variables per statement.
      let ps = mori.map((txChunk) => {
        const qs = `(?, ?, ?, ?, ?)${', (?, ?, ?, ?, ?)'.repeat(mori.count(txChunk) - 1)}`;
        return this.db
          .run(`INSERT INTO transactions (e, a, v, tx, added) VALUES ${qs}`,
               mori.intoArray(mori.mapcat(transactionToRow, txChunk)));
      }, mori.partitionAll(150, txData));

      // ps is a lazy sequence.  intoArray forces, like `seq`.
      ps = mori.intoArray(ps);
      return Promise.all(mori.intoArray(ps));
    });
  }

  async getLastTxInSnapshot() {
    const [{ lastTx }] =
      await this.db.all('SELECT COALESCE(MAX(tx), -1) AS lastTx FROM datoms');
    return lastTx;
  }

  /**
   * Replay transactions out of the DB against the given connection.
   *
   * @param fromTx smallest tx to replay.
   * @param toTx largest tx to replay.
   */
  async replayTransactions(conn, fromTx = 0, toTx = 1 << 30) {
    // TODO: larger upper bound?
    const rows = await this.db.all(`
      SELECT e, a, v, tx, added FROM transactions
      WHERE tx BETWEEN ? AND ?
      ORDER BY tx ASC`, [fromTx, toTx]);
    mori.each(mori.partitionBy((row) => row.tx, rows), (txRows) => {
      const assertions = mori.apply(vector, mori.map(
        (txRow) => vector(txRow.added ? DB_ADD : DB_RETRACT, txRow.e, txRow.a, txRow.v, txRow.tx),
        txRows));
      datascript.core.transact_BANG_(conn, assertions);
    });
  }

  /**
   * Load the current datom snapshot from disk.
   *
   * @return { conn, lastTx }.
   */
  async dbFromSnapshot(schema = datomstore.profileSchema) {
    const toDatom = (row) => d.datom(row.e, row.a, row.v, row.tx);

    // DataScript sorts the input datom set.  This does most of the sorting at the DB level.
    const rows = await this.db.all('SELECT e, a, v, tx FROM datoms ORDER BY e, a');
    return djs.init_db(mori.map(toDatom, rows), helpers.schema_to_clj(schema));
  }

  /**
   * Replace the current datom snapshot with the contents of `db`.
   *
   * @param db DataScript database to persist.
   */
  async replaceSnapshot(db) {
    const fromDatom = (x) => mori.vector(x.e, x.a, x.v, x.tx);

    const self = this;
    return await self.db.inTransaction(async function() {
      await self.db.run('DELETE FROM datoms');

      // Write 200 4-tuples at a time.  SQLite has a limit of 999 bound variables per statement.
      let ps = mori.map((datomsChunk) => {
        const qs = `(?, ?, ?, ?)${', (?, ?, ?, ?)'.repeat(mori.count(datomsChunk) - 1)}`;
        return self.db
          .run(`INSERT INTO datoms (e, a, v, tx) VALUES ${qs}`,
               mori.intoArray(mori.mapcat(fromDatom, datomsChunk)));
      }, mori.partitionAll(200, djs.datoms(db, mori.keyword('eavt'))));

      // ps is a lazy sequence.  intoArray forces, like `seq`.
      ps = mori.intoArray(ps);
      await Promise.all(mori.intoArray(ps));
    });
  }

  // /**
  //  * Update the current snapshot from the contents of the transaction table.
  //  *
  //  * @param db DataScript database to persist.
  //  */
  // async updateSnapshot(conn) {
  //   return await this.db.inTransaction(async function () {
  //     const { lastTxInSnapshot, conn } = await ProfileDatomStorage.loadSnapshot(this.db);
  //     await this.replayTransactions(lastTxInSnapshot + 1, );
  //
  //     // Write 200 4-tuples at a time.  SQLite has a limit of 999 bound variables per statement.
  //     let ps = mori.map((datomsChunk) => {
  //       const qs = `(?, ?, ?, ?)${', (?, ?, ?, ?)'.repeat(mori.count(datomsChunk) - 1)}`;
  //       return this.db
  //         .run(`INSERT INTO datoms (e, a, v, tx) VALUES ${qs}`,
  //              mori.intoArray(mori.mapcat((x) => mori.vector(x.e, x.a, x.v, x.tx),
  // datomsChunk))); }, mori.partitionAll(200, djs.datoms(djs.db(conn), mori.keyword('eavt'))));
  // // ps is a lazy sequence.  intoArray forces, like `seq`. ps = mori.intoArray(ps); await
  // Promise.all(mori.intoArray(ps)); }); }

  // createSchema() {
  //   return helpers.schema_to_clj(profileSchema);
  // }
}
