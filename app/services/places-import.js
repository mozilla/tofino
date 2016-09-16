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
import * as sqlite from 'promise-sqlite';

import { logger } from '../shared/logging';

const d = datascript.core;

const { vector, conj } = mori;
const { DB_ADD } = helpers;

export class PlacesImporter {
  constructor(placesDB) {
    this.db = placesDB;
    this.places = new Map();
  }

  async buildPlaceMap(limit = undefined) {
    const placeQuery = `SELECT p.id, p.url, p.title, p.visit_count, p.last_visit_date, p.guid,
    hv.visit_date
    FROM moz_places AS p LEFT JOIN moz_historyvisits AS hv
    WHERE p.hidden = 0 AND p.id = hv.place_id
    ORDER BY p.id, hv.visit_date
    ${limit ? ' LIMIT ?' : ''}
    `;
    await this.db.each(placeQuery, limit ? [limit] : [], row => {
      let place = this.places.get(row.id);
      if (!place) {
        place = {
          id: row.id,
          url: row.url,
          title: row.title,
          visit_count: row.visit_count,
          last_visit_date: row.last_visit_date,
          guid: row.guid,
          visits: [],
        };
        this.places.set(row.id, place);
      }

      // For now, build entire places tree in memory.  TODO: stream to the DS store.
      place.visits.push(row.visit_date);
    });
  }

  writePlacesTo(conn) {
    this.places.forEach(place => {
      let assertions = vector(
        vector(DB_ADD, -1, 'page/url', place.url),
        vector(DB_ADD, -1, 'page/guid', place.guid));

      if (place.title) {
        assertions = conj(assertions,
                   vector(DB_ADD, -1, 'page/title', place.title));
      }

      place.visits.forEach((visit, i) => {
        const vid = -2 - i;
        assertions = conj(assertions,
                   vector(DB_ADD, -1, 'event/visit', vid),
                   vector(DB_ADD, vid, 'visit/instant', visit));
      });

      d.transact_BANG_(conn, assertions);
    });
  }

  static async importFromPlaces(pathToPlaces, datomStorage, limit = undefined) {
    // The WAL is enabled, so opening read-only leaves orphaned .shm/.wal files.
    const placesDB = await sqlite.DB.open(pathToPlaces, { logger });
    try {
      const importer = new PlacesImporter(placesDB);
      await importer.buildPlaceMap(limit);
      importer.writePlacesTo(datomStorage.conn);
    } finally {
      await placesDB.close();
    }
  }
}
