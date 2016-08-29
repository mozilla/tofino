// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import { fixURL, getSearchURL } from '../../../../app/ui/browser-blueprint/browser-util';

describe('utils', () => {
  describe('fixURL', () => {
    it('should leave URIs unchanged', () => {
      const UNCHANGED_URIS = [
        'data:text/html,',
        'http://example.com',
      ];
      for (const url of UNCHANGED_URIS) {
        expect(fixURL(url)).toEqual(url);
      }
    });

    it('should append protocol onto URIs', () => {
      const CHANGED_URIS = [
        ['example.com', 'http://example.com'],
      ];
      for (const [input, url] of CHANGED_URIS) {
        expect(fixURL(input)).toEqual(url);
      }
    });

    it('should use a search engine for queries', () => {
      const SEARCH_TERMS = [
        ['search', getSearchURL('search')],
        ['another search', getSearchURL('another search')],
      ];
      for (const [input, url] of SEARCH_TERMS) {
        expect(fixURL(input)).toEqual(url);
      }
    });
  });
});
