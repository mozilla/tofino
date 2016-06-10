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


export class PlacesImporter {
  constructor(placesDB, datomStorage) {
    this.db = placesDB;
    this.store = datomStorage;
  }

  async buildPlaceMap() {
    const query = `SELECT id, url, title, visit_count, last_visit_date, guid
    FROM moz_places
    WHERE hidden = 0
    `;
    const places = new Map();
    const count = await this.db.each(query, (row) => {
      places[row.id] = {
        id: row.id,
        url: row.url,
        title: row.title,
        visit_count: row.visit_count,
        last_visit_date: row.last_visit_date,
        guid: row.guid,
      };
    });

    console.log(`Imported ${count} places.`);
    return places;
  }

  async importVisits(places) {
    const query = `SELECT id, from_visit, place_id, visit_date, visit_type, session
    FROM moz_historyvisits`;
    const count = await this.db.each(query, (row) => {
      const place = this.places[row.place_id];
      if (!place) {
        return;
      }
      console.log(`Place ${place.id}, ${place.url}, ${row.visit_date}`);
    });
    console.log(`Imported ${count} visits.`);
    return places;
  }

  async importPlaces() {
    const places = await this.buildPlaceMap();
    await this.importVisits(places);
  }
}
