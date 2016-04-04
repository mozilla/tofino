
const Dexie = require('dexie');

const browserDB = new Dexie('MyDB');
browserDB.version(1).stores({
  bookmarks: '++id, &url, created',
});
browserDB.open();

module.exports = browserDB;
