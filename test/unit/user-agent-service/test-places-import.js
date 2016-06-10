// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';

import path from 'path';

import {
  datascript,
  mori,
} from 'datascript-mori';

import { ProfileDatomStorage } from '../../../app/services/user-agent-service/datomstore';

import { PlacesImporter } from '../../../app/services/places-import';

const d = datascript.core;
const djs = datascript.js;

const TEST_PLACES_PATH = path.join(__dirname, 'test-places.db');

describe('Places importer', function() {
  it('Should import Places from disk.', function(done) {
    (async function () {
      try {
        const datomStorage = await ProfileDatomStorage.open('.'); // TODO: temporary directory.
        const conn = datomStorage.conn;

        const limit = undefined; // Use a small number in testing.
        await PlacesImporter.importFromPlaces(TEST_PLACES_PATH, datomStorage, limit);

        const dbAfter = djs.db(conn);

        expect(mori.count(dbAfter)).toBe(2407);

        let query = mori.parse(`
          [:find [?t ...]
           :in $ ?url
           :where
           [?pe "page/url" ?url]
           [?pe "event/visit" ?ve]
           [?ve "visit/instant" ?t]
          ]`);

        let results = mori.sort(d.q(query, dbAfter, 'https://reddit.com/'));
        expect(mori.count(results)).toBe(1196);
        expect(mori.first(results)).toBe(1440176482923983);
        expect(mori.last(results)).toBe(1464305350798879);

        query = mori.parse(`
          [:find [(pull ?pe ["page/guid"]) ...]
           :in $ ?url
           :where
           [?pe "page/url" ?url]
          ]`);

        results = d.q(query, dbAfter, 'http://www.apple.com/ca/');
        expect(mori.count(results)).toBe(1);
        expect(mori.get(mori.first(results), 'page/guid')).toBe('8gKc0hLRWhom');

        done();
      } catch (e) {
        done(e);
      }
    }());
  });
});
