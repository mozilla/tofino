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

const debug = false;

// Associate URLs with persistent IDs.
// Note the use of AUTOINCREMENT to ensure that IDs are never reused after deletion.
const tablePlacesV5 = `CREATE TABLE placeEvents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  url TEXT UNIQUE NOT NULL,
  ts INTEGER NOT NULL
)`;

// Associate titles with places.
const tableTitlesV5 = `CREATE TABLE titleEvents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  place INTEGER NOT NULL REFERENCES placeEvents(id),
  ts INTEGER NOT NULL,
  title TEXT NOT NULL
)`;

// Associate visits with places.
const tableVisitsV5 = `CREATE TABLE visitEvents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  place INTEGER NOT NULL REFERENCES placeEvents(id),
  ts INTEGER NOT NULL,
  session INTEGER NOT NULL REFERENCES sessionStarts(id),
  type INTEGER NOT NULL
)`;

// Track the start of a session. Note that each session has a unique identifier, can
// be born of another (the ancestor), and can be within a scope (e.g., a window ID).
const tableSessionStartsV5 = `CREATE TABLE sessionStarts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  scope INTEGER,
  ancestor INTEGER REFERENCES sessionStarts(id),
  ts INTEGER NOT NULL,
  reason TINYINT NOT NULL DEFAULT 0
)`;

// Track the end of a session. Note that sessions must be started before they are
// ended.
const tableSessionEndsV5 = `CREATE TABLE sessionEnds (
  id INTEGER PRIMARY KEY REFERENCES sessionStarts(id),
  ts INTEGER NOT NULL,
  reason TINYINT NOT NULL DEFAULT 0
)`;

const tableStarsV5 = `CREATE TABLE starEvents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  place INTEGER NOT NULL REFERENCES placeEvents(id),
  session INTEGER NOT NULL REFERENCES sessionStarts(id),
  action TINYINT NOT NULL,
  ts INTEGER NOT NULL
)`;

// Optional settings:
// tokenize="porter"
// prefix='2,3'
// By default we use Unicode-aware tokenizing (particularly for case folding), but
// preserve diacritics.
const virtualTableContentV5 = `
CREATE VIRTUAL TABLE pages
USING FTS4 (place, session, ts, title, excerpt, content, tokenize=unicode61 "remove_diacritics=0")
`;

const viewStarsV5 = `CREATE VIEW vStarred AS
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

const materializedStarsV5 = `CREATE TABLE mStarred (
  place INTEGER NOT NULL UNIQUE REFERENCES placeEvents(id),
  ts INTEGER NOT NULL,
  url TEXT NOT NULL
)`;

// We maximize on timestamp, not ID, but we can change our mind later.
const viewTitlesV5 = `CREATE VIEW vTitles AS
SELECT id AS titleID, MAX(ts) AS titleTS, place, title FROM titleEvents GROUP BY place
`;

const viewVisitsV5 = `CREATE VIEW vVisits AS
SELECT id AS visitID, MAX(ts) AS lastVisited, COUNT(id) AS visitCount, place
FROM visitEvents GROUP BY place
`;

const viewHistoryV5 = `CREATE VIEW vHistory AS
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

const materializedHistoryV5 = `CREATE TABLE mHistory (
  place INTEGER NOT NULL REFERENCES placeEvents(id),
  url TEXT NOT NULL,
  lastTitle TEXT,
  lastVisited INTEGER NOT NULL,
  visitCount INTEGER NOT NULL
)`;

export class ProfileStorageSchemaV5 {
  constructor() {
    this.version = 5;
  }

  /**
   * Take a newly opened ProfileStorage and make sure it reaches v5.
   * @param storage an open storage instance.
   */
  async createOrUpdate(storage) {
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

  async update(storage, from) {
    async function migrateSessionsToV5() {
      await storage.db.run(`
        ALTER TABLE sessionStarts
        ADD COLUMN reason TINYINT NOT NULL DEFAULT 0
        `);
      await storage.db.run(`
        ALTER TABLE sessionEnds
        ADD COLUMN reason TINYINT NOT NULL DEFAULT 0
        `);
    }

    // Precondition: from < this.version.
    // Precondition: from > 0 (else we'd call `create`).
    switch (from) {
      case 1:
        await storage.db.run(tableTitlesV5);
        await storage.db.run(tableSessionStartsV5);
        await storage.db.run(tableSessionEndsV5);
        await storage.db.run(tableStarsV5);

        // Change the schema for visits. Lose existing ones.
        await storage.db.run('DROP TABLE visitEvents');
        await storage.db.run(tableVisitsV5);

        // Add text indexing.
        await storage.db.run(virtualTableContentV5);

        await storage.db.run(`PRAGMA user_version = ${this.version}`);
        break;

      case 2:

        // Tables.
        await storage.db.run(tableStarsV5);

        // We gave titles and visits IDs.
        await storage.db.run('DROP TABLE visitEvents');
        await storage.db.run('DROP TABLE titleEvents');
        await storage.db.run(tableVisitsV5);
        await storage.db.run(tableTitlesV5);

        // Views.
        await storage.db.run(viewStarsV5);
        await storage.db.run(viewVisitsV5);
        await storage.db.run(viewTitlesV5);
        await storage.db.run(viewHistoryV5);

        // Materialized views.
        await storage.db.run(materializedStarsV5);
        await storage.db.run(materializedHistoryV5);
        await storage.materializeStars();
        await storage.materializeHistory();

        migrateSessionsToV5();

        // Add text indexing.
        await storage.db.run(virtualTableContentV5);

        await storage.db.run(`PRAGMA user_version = ${this.version}`);
        break;

      case 3:

        // No tables change in v3 -> v5: it's just adding a materialized view.
        // Views.
        await storage.db.run(viewStarsV5);
        await storage.db.run(viewVisitsV5);
        await storage.db.run(viewTitlesV5);
        await storage.db.run(viewHistoryV5);

        // Materialized views.
        await storage.db.run(materializedStarsV5);
        await storage.db.run(materializedHistoryV5);
        await storage.materializeStars();
        await storage.materializeHistory();

        migrateSessionsToV5();

        // Add text indexing.
        await storage.db.run(virtualTableContentV5);

        await storage.db.run(`PRAGMA user_version = ${this.version}`);
        break;

      case 4:

        migrateSessionsToV5();

        // Add text indexing.
        await storage.db.run(virtualTableContentV5);

        await storage.db.run(`PRAGMA user_version = ${this.version}`);
        break;

      default:
        throw new Error(`Can\'t upgrade from ${from}: outside v1-v4.`);
    }

    return storage.userVersion();
  }

  async create(storage) {
    // Tables.
    await storage.db.run(tablePlacesV5);
    await storage.db.run(tableTitlesV5);
    await storage.db.run(tableVisitsV5);
    await storage.db.run(tableStarsV5);
    await storage.db.run(tableSessionStartsV5);
    await storage.db.run(tableSessionEndsV5);

    // Views.
    await storage.db.run(viewStarsV5);
    await storage.db.run(viewVisitsV5);
    await storage.db.run(viewTitlesV5);
    await storage.db.run(viewHistoryV5);

    // Materialized views.
    await storage.db.run(materializedStarsV5);
    await storage.db.run(materializedHistoryV5);
    await storage.materializeStars();
    await storage.materializeHistory();

    // Text indexing.
    await storage.db.run(virtualTableContentV5);

    await storage.db.run(`PRAGMA user_version = ${this.version}`);

    return storage.userVersion();
  }
}
