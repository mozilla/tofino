// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';

import fs from 'fs';
import path from 'path';
import tmp from 'tmp';
import { UserAgentService } from '../../../app/services/user-agent-service';
import { UserAgentHttpClient } from '../../../app/shared/user-agent-http-client';
import * as endpoints from '../../../app/shared/constants/endpoints';

describe('User Agent Service', () => {
  let tempDir = null;
  let port = 19090; // Start well past our UA and content server defaults.
  let stop = null;
  let userAgentHttpClient = null;

  beforeEach(done => {
    stop = null;
    tempDir = tmp.dirSync({}).name;
    (async function () {
      try {
        port += 1; // Advance first, so that we don't stick on a blocked port.
        stop = await UserAgentService( // eslint-disable-line
          {
            port: ++port,
            db: tempDir,
            version: 'v1',
            contentServiceOrigin: `${endpoints.TOFINO_PROTOCOL}://`,
          });
        userAgentHttpClient = new UserAgentHttpClient({
          version: 'v1',
          host: endpoints.UA_SERVICE_ADDR,
          port });

        done();
      } catch (e) {
        done(e);
      }
    }());
  });

  afterEach(done => {
    (async function () {
      try {
        if (stop) {
          try {
            await stop();
          } catch (f) {
            // Ignore this error -- any earlier error is almost always more interesting.
            console.log(`Ignoring error stopping test User Agent service: ${f}`); // eslint-disable-line
          }
        }

        try {
          // These should be the only files after we close.
          fs.unlinkSync(path.join(tempDir, 'browser.db'));
          fs.unlinkSync(path.join(tempDir, 'ua-service.log'));
          fs.rmdirSync(tempDir);
        } catch (g) {
          // Ignore this error -- any earlier error is almost always more interesting.  On AppVeyor,
          // we often see "Error: EBUSY: resource busy or locked, unlink" (like
          // https://ci.appveyor.com/project/Mozilla/tofino-u1hv8/build/1.0.931-asyctcfp).  Ignore
          // such errors.
          console.log(`Ignoring error deleting test User Agent service files: ${g}`); // eslint-disable-line
        }

        done();
      } catch (e) {
        done(e);
      }
    }());
  });

  it('handles sessions', done => {
    (async function () {
      try {
        // TODO: add a /sessions endpoint to allow to truly verify these API calls.
        expect(await userAgentHttpClient.createSession(11, { scope: 0 }))
          .toEqual({ session: 1 });
        expect(await userAgentHttpClient.createSession(12, { scope: 0, ancestor: 1 }))
          .toEqual({ session: 2 });
        expect(await userAgentHttpClient.destroySession({ sessionId: 2 }, { reason: 'None' }))
          .toEqual({});

        done();
      } catch (e) {
        done(e);
      }
    }());
  });

  it('handles history visits', done => {
    (async function () {
      try {
        expect(await userAgentHttpClient.createSession(11, { scope: 0 }))
          .toEqual({ session: 1 });
        const page = { sessionId: 1 }; // TODO: don't 500 when sessionId is not recognized.

        expect(await userAgentHttpClient.createHistory(page, {
          url: 'https://reddit.com/',
          title: 'reddit - the front page of the internet',
        }))
          .toEqual({});

        // No title.
        expect(await userAgentHttpClient.createHistory(page, {
          url: 'https://www.mozilla.org/en-US/firefox/new/',
        }))
          .toEqual({});

        const results1 = (await userAgentHttpClient.visited({ limit: 2 })).results;
        expect(results1.length).toEqual(2);
        const [r1, r2] = results1;
        // TODO: expect(r1.lastVisited).toBeLessThan(Date.now()); // Ensure we're in milliseconds.
        // TODO: expect(r2.lastVisited).toBeLessThan(Date.now()); // Ensure we're in milliseconds.
        delete r1.lastVisited;
        delete r2.lastVisited;
        expect([r1, r2]).toEqual(
          [
            { snippet: null,
              title: null,
              url: 'https://www.mozilla.org/en-US/firefox/new/' },
            { snippet: null,
              title: 'reddit - the front page of the internet',
              url: 'https://reddit.com/' },
          ]);

        const results3 = (await userAgentHttpClient.visited({ limit: 1 })).results;
        expect(results3.length).toEqual(1);
        const [r3] = results3;
        // TODO: expect(r3.lastVisited).toBeLessThan(Date.now()); // Ensure we're in milliseconds.
        delete r3.lastVisited;
        expect([r3]).toEqual(
          [
            { snippet: null,
              title: null,
              url: 'https://www.mozilla.org/en-US/firefox/new/' },
          ]);

        done();
      } catch (e) {
        done(e);
      }
    }());
  });

  it('handles stars', done => {
    (async function () {
      try {
        expect(await userAgentHttpClient.createSession(11, { scope: 0 }))
          .toEqual({ session: 1 });
        const page = { sessionId: 1 }; // TODO: don't 500 when sessionId is not recognized.

        // TODO: make createStar({ title }) actually write the title to the DB.
        for (let i = 1; i < 10; i++) {
          expect(await userAgentHttpClient.createHistory(page, {
            url: `https://test.com/${i}`,
            title: `test${i}`,
          }))
            .toEqual({});

          expect(await userAgentHttpClient.createStar(page, {
            url: `https://test.com/${i}`,
            // TODO: make this work. title: `test${i}`,
          }))
            .toEqual({});
        }

        // One with no title.
        expect(await userAgentHttpClient.createStar(page, {
          url: 'https://test.com/10',
        }))
          .toEqual({});

        // TODO: location should be uniform url.
        const results1 = (await userAgentHttpClient.stars({ limit: 2 })).results;
        expect(results1.length).toEqual(2);
        const [r1, r2] = results1;
        // TODO: expect(r1.lastVisited).toBeLessThan(Date.now()); // Ensure we're in milliseconds.
        // TODO: expect(r2.lastVisited).toBeLessThan(Date.now()); // Ensure we're in milliseconds.
        delete r1.lastVisited;
        delete r2.lastVisited;
        expect([r1, r2]).toEqual(
          [
            { title: null, location: 'https://test.com/10' },
            { title: 'test9', location: 'https://test.com/9' },
          ]);

        expect(await userAgentHttpClient.destroyStar(page, {
          url: 'https://test.com/10',
        }))
          .toEqual({});

        expect(await userAgentHttpClient.destroyStar(page, {
          url: 'https://test.com/8',
        }))
          .toEqual({});

        const results3 = (await userAgentHttpClient.stars({ limit: 1 })).results;
        expect(results3.length).toEqual(1);
        const [r3] = results3;
        // TODO: expect(r3.lastVisited).toBeLessThan(Date.now()); // Ensure we're in milliseconds.
        delete r3.lastVisited;
        expect([r3]).toEqual(
          [
            { title: 'test9', location: 'https://test.com/9' },
          ]);

        done();
      } catch (e) {
        done(e);
      }
    }());
  });

  it('handles page details', done => {
    (async function () {
      try {
        expect(await userAgentHttpClient.createSession(11, { scope: 0 }))
          .toEqual({ session: 1 });
        const page = { sessionId: 1 }; // TODO: don't 500 when sessionId is not recognized.

        expect(await userAgentHttpClient.createHistory(page, {
          url: 'https://test.com/',
          title: 'test.com',
        }))
          .toEqual({});

        expect(await userAgentHttpClient.createPage(page, {
          url: 'https://test.com/',
          readerResult: {
            title: 'test.com',
            excerpt: 'excerpt from test.com',
            textContent: 'Long text content containing excerpt from test.com and other stuff.',
          },
        }))
          .toEqual({});

        const q = { text: 'Long text', limit: 2, snippetSize: 'tiny' };
        const results1 = (await userAgentHttpClient.query(q)).results;
        expect(results1.length).toEqual(1);
        const [r1] = results1;
        // TODO: expect(r1.lastVisited).toBeLessThan(Date.now()); // Ensure we're in milliseconds.
        delete r1.lastVisited;
        expect([r1]).toEqual(
          [
            { title: 'test.com',
              url: 'https://test.com/',
              snippet: '<b>Long</b> <b>text</b> content containing excerpt…',
            },
          ]);

        done();
      } catch (e) {
        done(e);
      }
    }());
  });
});
