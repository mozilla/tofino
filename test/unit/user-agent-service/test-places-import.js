// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import { DB } from '../../../app/services/user-agent-service/sqlite';
import { PlacesImporter } from '../../../app/services/places';

describe('Places importer', () => {
  it('Imports', async () => {
    console.log('Importing.');
    const filePath = '/Users/rnewman/moz/git/export/mine.sqlite';
    const db = await DB.open(filePath);
    const importer = new PlacesImporter(db, undefined);
    await importer.importPlaces();
  });
});