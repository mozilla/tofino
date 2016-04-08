/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

// Modified from the following fils:
//  * http://mxr.mozilla.org/gaia/source/shared/js/url_helper.js
//  * https://github.com/brave/browser-laptop/blob/master/js/lib/urlutil.js
// Changed to use require('url').parse instead of window.URL and document.createElement('a')

import { parse } from 'url';

// characters, then : with optional //
const rscheme = /^(?:[a-z\u00a1-\uffff0-9-+]+)(?::(\/\/)?)/i;
const defaultScheme = 'http://';
const fileScheme = 'file://';

/**
 * A simple class for parsing and dealing with URLs.
 * @class UrlUtil
 */
const UrlUtil = {

  /**
   * Extracts the scheme from a value.
   * @param {String} input The input value.
   * @returns {String} The found scheme.
   */
  getScheme(input) {
    // This function returns one of following:
    // - scheme + ':' (ex. http:)
    // - scheme + '://' (ex. http://)
    // - null
    const scheme = (rscheme.exec(input) || [null])[0];
    return scheme === 'localhost://' ? null : scheme;
  },

  /**
   * Checks if an input has a scheme (e.g., http:// or ftp://).
   * @param {String} input The input value.
   * @returns {Boolean} Whether or not the input has a scheme.
   */
  hasScheme(input) {
    return !!this.getScheme(input);
  },

  /**
   * Prepends file scheme for file paths, otherwise the default scheme
   * @param {String} input path, with opetional schema
   * @returns {String} path with a scheme
   */
  prependScheme(input) {
    // @TODO: expand relative path.  Should not access os.homedir();
    // if (input.startsWith('~/')) {
    //   input = input.replace(/^~/, os.homedir());
    // }

    // detect absolute file paths
    if (input.startsWith('/')) {
      input = fileScheme + input;
    }

    // If there's no scheme, prepend the default scheme
    if (!this.hasScheme(input)) {
      input = defaultScheme + input;
    }

    return input;
  },

  /**
   * Converts an input string into a URL.
   * @param {String} input The input value.
   * @returns {String} The formatted URL.
   */
  getUrlFromInput(input) {
    input = input.trim();

    input = this.prependScheme(input);

    if (!this.isURL(input)) {
      return input;
    }

    return parse(input).href;
  },

  /**
   * Checks if a given input is a valid URL.
   * @param {String} input The input URL.
   * @returns {Boolean} Whether or not this is a valid URL.
   */
  isURL(input) {
    function isNotURL() {
      // for cases, ?abc and "a? b" which should searching query
      const case1Reg = /^(\?)|(\?.+\s)/;

      // for cases, pure string
      const case2Reg = /[\?\.\s\:]/;

      // for cases, data:uri and view-source:uri
      const case3Reg = /^\w+\:.*/;

      let str = input.trim();
      if (case1Reg.test(str) || !case2Reg.test(str) ||
          UrlUtil.getScheme(str) === str) {
        return true;
      }
      if (case3Reg.test(str)) {
        return false;
      }

      str = UrlUtil.prependScheme(str);
      const parsed = parse(str);
      return !parsed.protocol || !parsed.host || !parsed.host.includes('.');
    }
    return !isNotURL();
  },

  /**
   * Checks if a URL is a view-source URL.
   * @param {String} input The input URL.
   * @returns {Boolean} Whether or not this is a view-source URL.
   */
  isViewSourceUrl(url) {
    return url.toLowerCase().startsWith('view-source:');
  },

  /**
   * Checks if a url is a data url.
   * @param {String} input The input url.
   * @returns {Boolean} Whether or not this is a data url.
   */
  isDataUrl(url) {
    return this.isURL(url) && this.getScheme(url) === 'data:';
  },

  /**
   * Converts a view-source url into a standard url.
   * @param {String} input The view-source url.
   * @returns {String} A normal url.
   */
  getUrlFromViewSourceUrl(input) {
    if (!this.isViewSourceUrl(input)) {
      return input;
    }
    return this.getUrlFromInput(input.substring('view-source:'.length));
  },

  /**
   * Converts a URL into a view-source URL.
   * @param {String} input The input URL.
   * @returns {String} The view-source URL.
   */
  getViewSourceUrlFromUrl(input) {
    if (this.isViewSourceUrl(input)) {
      return input;
    }

    // Normalizes the actual URL before the view-source: scheme like prefix.
    return `view-source:${this.getUrlFromViewSourceUrl(input)}`;
  },

  /**
   * Extracts the hostname or returns undefined.
   * @param {String} input The input URL.
   * @returns {String} The host name.
   */
  getHostname(input) {
    return parse(input).host || null;
  },
};

export default UrlUtil;
