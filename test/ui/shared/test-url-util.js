/* global describe, it */

import expect from 'expect';
import UrlUtil from '../../../ui/shared/url-util';

describe('UrlUtil', () => {
  describe('getHostname', () => {
    it('returns hostname for full url', () => {
      expect(UrlUtil.getHostname('http://example.com')).toEqual('example.com');
    });
    it('returns null for empty url', () => {
      expect(UrlUtil.getHostname('')).toEqual(null);
    });
  });

  describe('getScheme', () => {
    it('is null for empty', () => {
      expect(UrlUtil.getScheme('/file/path/to/file')).toEqual(null);
    });

    it('is null for localhost', () => {
      expect(UrlUtil.getScheme('localhost://127.0.0.1')).toEqual(null);
    });

    it('gets scheme with :', () => {
      expect(UrlUtil.getScheme('data:text/html,')).toEqual('data:');
    });

    it('gets scheme with ://', () => {
      expect(UrlUtil.getScheme('http://www.mozilla.org')).toEqual('http://');
    });
  });

  describe('prependScheme', () => {
    it('prepends file:// to absolute file path', () => {
      expect(UrlUtil.prependScheme('/file/path/to/file')).toEqual('file:///file/path/to/file');
    });

    it('defaults to http://', () => {
      expect(UrlUtil.prependScheme('www.mozilla.org')).toEqual('http://www.mozilla.org');
    });

    it('keeps schema if already exists', () => {
      expect(UrlUtil.prependScheme('https://www.mozilla.org')).toEqual('https://www.mozilla.org');
    });
  });

  describe('isURL', () => {
    it.skip('absolute file path without scheme', () => {
      expect(UrlUtil.isURL('/file/path/to/file')).toEqual(true);
    });

    it('absolute file path with scheme', () => {
      expect(UrlUtil.isURL('file:///file/path/to/file')).toEqual(true);
    });

    it('detects data URI', () => {
      expect(UrlUtil.isURL('data:datauri')).toEqual(true);
    });

    it('detects falsy URIs', () => {
      expect(UrlUtil.isURL('foobar')).toEqual(false);
    });
  });
});
