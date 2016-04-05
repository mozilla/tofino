
import expect from 'expect';
import { fixURL, getSearchURL } from '../../../ui/browser/browser-util';

describe('utils', function() {
  describe('fixURL', function() {
    it('should leave URIs unchanged', function() {
      const UNCHANGED_URIS = [
        'data:text/html,',
        'http://example.com',
      ];
      for (let url of UNCHANGED_URIS) {
        expect(fixURL(url)).toEqual(url);
      }
    });

    it('should append protocol onto URIs', function() {
      const CHANGED_URIS = [
        ['example.com', 'http://example.com'],
      ];
      for (let [input, url] of CHANGED_URIS) {
        expect(fixURL(input)).toEqual(url);
      }
    });

    it('should use a search engine for queries', function() {
      const SEARCH_TERMS = [
        ['search', getSearchURL('search')],
        ['another search', getSearchURL('another search')],
      ];
      for (let [input, url] of SEARCH_TERMS) {
        expect(fixURL(input)).toEqual(url);
      }
    });
  });
});
