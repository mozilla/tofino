// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/* eslint-disable no-console */

import expect from 'expect';

import {
  datascript,
  helpers,
  mori,
} from 'datascript-mori';

import { ProfileDatomStorage } from '../../../app/services/user-agent-service/datomstore';
import { StarOp } from '../../../app/services/user-agent-service/storage';

const { vector, getIn } = mori;
const { DB_ADD, TEMPIDS } = helpers;

// So that tests don't take forever and time out.
const perfTesting = false;

describe('Storage.recentlyStarred', () => {
  it('Stars and unstars.', async () => {
    const db = new ProfileDatomStorage();
    const A = await db.recentlyStarred();
    expect(mori.count(A)).toBe(0);
    await db.starPage('http://foo.com/bar', 0, StarOp.star, 1234567890);
    const B = await db.recentlyStarred();
    expect(mori.count(B)).toBe(1);

    const { visitedAt, location, title } = mori.first(B);
    expect(visitedAt).toBe(1234567890);
    expect(location).toBe('http://foo.com/bar');
    expect(title).toNotExist();

    await db.starPage('http://foo.com/bar', 0, StarOp.unstar, 1234567891);
    const C = await db.recentlyStarred();
    expect(mori.count(C)).toBe(0);
  });

  it('Cannot re-star.', async () => {
    const db = new ProfileDatomStorage();
    await db.starPage('http://foo.com/bar', 0, StarOp.star, 1234567892);
    expect(mori.first(await db.recentlyStarred()).visitedAt).toBe(1234567892);
    await db.starPage('http://foo.com/bar', 0, StarOp.star, 1234567900);
    expect(mori.count(await db.recentlyStarred())).toBe(1);
    expect(mori.first(await db.recentlyStarred()).visitedAt).toBe(1234567892);
  });
});

describe('Storage.visited', () => {
  it('Empty fetches with no limit.', async () => {
    const db = new ProfileDatomStorage();
    const result = await db.visited();
    expect(mori.isEmpty(result)).toBeTruthy();
  });

  it('Smushes URLs for multiple transacts.', async () => {
    const db = new ProfileDatomStorage();
    const resultA = datascript.core.transact_BANG_(db.conn, vector(
      vector(DB_ADD, -1, 'page/url', 'http://example.com')
    ));
    const resultB = datascript.core.transact_BANG_(db.conn, vector(
      vector(DB_ADD, -2, 'page/url', 'http://example.com')
    ));

    expect(getIn(resultA, [TEMPIDS, -1])).toBe(getIn(resultB, [TEMPIDS, -2]));
  });

  it('Fetches a single row with more than one visit.', async () => {
    const db = new ProfileDatomStorage();
    const session = await db.startSession('here', null, 1234567890);
    const pageA = await db.visit('http://example.com/foo/', session, 'Example Páge', 1234567900);
    const pageB = await db.visit('http://example.com/foo/', session, 'Example Páge 2', 1234567910);

    expect(pageA).toBe(pageB);

    const start = Date.now();
    const result = await db.visited();

    // We got one result, despite there being two visits.
    expect(mori.isSeq(result)).toBeTruthy();
    expect(mori.count(result)).toBe(1);

    // The result has the latest timestamp and title.
    const { lastVisited, uri, title } = mori.first(result);
    const end = Date.now();
    expect(lastVisited).toBe(1234567910);
    expect(uri).toBe('http://example.com/foo/');
    expect(title).toBe('Example Páge 2');
    console.log(`Fetching one visited took ${end - start} ms.\n`);
  });

  it('Matches substrings.', async () => {
    const db = new ProfileDatomStorage();
    const session = await db.startSession('here', null, 1234567890);
    await db.visit('http://example.com/foo/', session, 'Example Páge', 1234567900);
    await db.visit('http://example.com/bar/', session, 'Example Páge 2', 1234567910);

    const start = Date.now();
    const foo = await db.visitedMatches('foo');
    expect(mori.count(foo)).toBe(1);
    const xar = await db.visitedMatches('xar');
    expect(mori.count(xar)).toBe(0);
    const páge = await db.visitedMatches('PÁGE');   // Hooray collation!
    expect(mori.count(páge)).toBe(2);
    const end = Date.now();
    console.log(`Three queries took ${end - start} ms.\n`);
  });

  if (perfTesting) {
    it('Performs reasonably well with lots of data.', async() => {
      const db = new ProfileDatomStorage();
      const session = await db.startSession('here', null, 1234567890);

      let visitCount = 0;
      for (let i = 0; i < 10000; i++) {
        for (let j = 0; j < (3 * (Math.random())); j++) {
          visitCount++;
          await db.visit(`http://example.com/foo/${i}`,
            session,
            `Example Páge ${i}`,
            1234567900 + (Math.random() * 10000)
          );
        }
      }
      const start = Date.now();
      const results = await db.visited(0, 100);
      mori.count(results);
      const end = Date.now();
      console.log(`One big query over ${visitCount} took ${end - start} ms.\n`);
    });
  }

  it('Obeys limits.', async () => {
    const db = new ProfileDatomStorage();
    const session = await db.startSession('here', null, 1234567890);
    await db.visit('http://example.com/foo/', session, 'Example Páge', 1234567900);
    await db.visit('http://example.com/bar/', session, 'Example Páge 2', 1234567910);
    await db.visit('http://example.com/baz/', session, null, 1234567920);
    await db.visit('http://example.com/noo/', session, 'Example Páge 3', 1234567930);

    async function urlsWithLimit(limit) {
      const results = await db.visited(0, limit);
      return mori.toJs(results).map((x) => x.uri);
    }

    const urls = [
      'http://example.com/noo/',
      'http://example.com/baz/',
      'http://example.com/bar/',
      'http://example.com/foo/',
    ];

    const start = Date.now();
    expect((await urlsWithLimit(0))).toEqual(urls);
    expect((await urlsWithLimit(undefined))).toEqual(urls);

    expect((await urlsWithLimit(5))).toEqual(urls);
    expect((await urlsWithLimit(4))).toEqual(urls);

    expect((await urlsWithLimit(3))).toEqual(urls.slice(0, 3));
    expect((await urlsWithLimit(2))).toEqual(urls.slice(0, 2));
    expect((await urlsWithLimit(1))).toEqual(urls.slice(0, 1));
    const end = Date.now();
    console.log(`Seven queries took ${end - start} ms.\n`);
  });
});
