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

import { ProfileStorage } from './storage';

const debug = false;

// Associate URLs with persistent IDs.
// Note the use of AUTOINCREMENT to ensure that IDs are never reused after deletion.
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

export class ProfileStorageSchemaV4 {
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
      if (debug) {
        console.log(`Storage already at version ${v}.`);
      }
      return v;
    }

    if (v === 0) {
      if (debug) {
        console.log(`Creating storage at version ${this.version}.`);
      }
      return this.create(storage);
    }

    if (v < this.version) {
      if (debug) {
        console.log(`Updating storage from ${v} to ${this.version}.`);
      }
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
        throw new Error('Can\'t upgrade from anything other than v1 or v2.');
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
