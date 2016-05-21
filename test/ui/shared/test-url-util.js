// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import URLUtil from '../../../ui/shared/url-util';

describe('URLUtil', () => {
  describe('getURL', () => {
    it('returns host for full url', () => {
      expect(URLUtil.getURL('http://example.com').host).toEqual('example.com');
    });
    it('returns null host for empty url', () => {
      expect(URLUtil.getURL('').host).toEqual('');
    });
  });

  describe('getScheme', () => {
    it('is null for empty', () => {
      expect(URLUtil.getScheme('/file/path/to/file')).toEqual(null);
    });

    it('gets scheme with :', () => {
      expect(URLUtil.getScheme('data:text/html,')).toEqual('data:');
    });

    it('gets scheme with ://', () => {
      expect(URLUtil.getScheme('http://www.mozilla.org')).toEqual('http://');
    });
  });

  describe('prependScheme', () => {
    it('prepends file:// to absolute file path', () => {
      expect(URLUtil.prependScheme('/file/path/to/file')).toEqual('file:///file/path/to/file');
    });

    it('defaults to http://', () => {
      expect(URLUtil.prependScheme('www.mozilla.org')).toEqual('http://www.mozilla.org');
    });

    it('keeps schema if already exists', () => {
      expect(URLUtil.prependScheme('https://www.mozilla.org')).toEqual('https://www.mozilla.org');
    });
  });

  describe('isURL', () => {
    it('absolute file path with scheme', () => {
      expect(URLUtil.isURL('file:///file/path/to/file')).toEqual(true);
    });

    it('detects data URL', () => {
      expect(URLUtil.isURL('data:datauri')).toEqual(true);
    });

    it('detects falsy URLs', () => {
      expect(URLUtil.isURL('foobar')).toEqual(false);
    });
  });

  describe('fixupURLString', () => {
    it('returns the input for non valid URLs', () => {
      expect(URLUtil.fixupURLString('foo')).toEqual('foo');
    });

    it('returns a URL string for valid inputs', () => {
      expect(URLUtil.fixupURLString('foo.com')).toEqual('http://foo.com');
    });
  });
});
