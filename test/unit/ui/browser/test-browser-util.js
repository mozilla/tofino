// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import { fixURL, getSearchURL } from '../../../../app/ui/browser/browser-util';

describe('utils', () => {
  describe('fixURL', () => {
    it('should leave URIs unchanged', () => {
      const UNCHANGED_URIS = [
        'data:text/html,',
        'http://example.com',
        'http://foo',
        'http://foo.com',
        'https://foo',
        'https://foo.com',
        'data:about',
        'view-source:http://foo.com/',
        'rtsp://100.100.100.100/rtsp.mp4',
      ];
      for (const url of UNCHANGED_URIS) {
        expect(fixURL(url)).toEqual(url);
      }
    });

    it('should append protocol onto URIs', () => {
      const CHANGED_URIS = [
        ['example.com', 'http://example.com/'],
        ['example.net', 'http://example.net/'],
        ['foo.bar', 'http://foo.bar/'],
        ['blerg.co.uk', 'http://blerg.co.uk/'],
        ['blach.com', 'http://blach.com/'],
        ['www.blah.com', 'http://www.blah.com/'],
        [' mozilla.org', 'http://mozilla.org/'],
      ];
      for (const [input, url] of CHANGED_URIS) {
        expect(fixURL(input)).toEqual(url);
      }
    });

    it('should use a search engine for queries', () => {
      const SEARCH_TERMS = [
        'data:',
        'search',
        'another search',
        'data',
        'a ? b',
        'a . b ?',
        'what is mozilla',
        'what is mozilla?',
        'www.blah.com foo',
        'a?some b',
        'docshell site:mozilla.org',
        '?mozilla',
        '?site:mozilla.org docshell',
        'http:',
        'a?',
        'a?b',
      ];
      for (const input of SEARCH_TERMS) {
        expect(fixURL(input)).toEqual(getSearchURL(input));
      }
    });
  });
});
