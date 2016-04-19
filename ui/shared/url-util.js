/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

// Modified from the following files:
//  * http://mxr.mozilla.org/gaia/source/shared/js/url_helper.js
//  * https://github.com/brave/browser-laptop/blob/master/js/lib/urlutil.js
// Changed to use require('url').parse instead of window.URL and document.createElement('a')

import { parse } from 'url';

// characters, then : with optional //
const rScheme = /^(?:[a-z\u00a1-\uffff0-9-+]+)(?::(\/\/)?)/i;
const rNestedProtocol = /^(data|view-source)\:.+/;
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
    const scheme = (rScheme.exec(input) || [null])[0];
    return scheme;
  },

  /**
   * Prepends file scheme for file paths, otherwise the default scheme
   * @param {String} input path, with opetional schema
   * @returns {String} path with a scheme
   */
  prependScheme(input) {
    input = input.trim();

    // @TODO: expand relative path.  Should not access os.homedir();
    // if (input.startsWith('~/')) {
    //   input = input.replace(/^~/, os.homedir());
    // }

    // Detect absolute file paths
    if (input.startsWith('/')) {
      input = fileScheme + input;
    }

    // If there's no scheme, prepend the default scheme
    if (!this.getScheme(input)) {
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
    input = this.prependScheme(input);

    if (!this.isURL(input)) {
      return input;
    }

    if (rNestedProtocol.test(input)) {
      return input;
    }

    const parsed = parse(input);
    let href = parsed.href;

    // Remove trailing '/'
    if (parsed.path === '/') {
      href = href.substring(0, href.length - 1);
    }

    return href;
  },

  /**
   * Checks if a given input is a valid URL.
   * @param {String} input See getUrl
   * @returns {Boolean} Whether or not this is a valid URL.
   */
  isURL(input) {
    input = input.trim();
    if (rNestedProtocol.test(input)) {
      return true;
    }

    const parsed = this.getUrl(input);
    const isFile = parsed.protocol === 'file:';
    const isValidHost = isFile || (parsed.host && parsed.host.includes('.'));
    return parsed.protocol && isValidHost;
  },

  /**
   * Checks if a given input is a valid URL.
   * @param {String} input A url-like string that doesn't
   *                 need to have a scheme,for example 'mozilla.com'.
   * @returns {Url} A Url object from nodejs 'url' library
   */
  getUrl(input) {
    input = UrlUtil.prependScheme(input);
    return parse(input);
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
   * Extracts the hostname or returns undefined.
   * @param {String} input The input URL.
   * @returns {String} The host name.
   */
  getHostname(input) {
    return parse(input).host || null;
  },
};

export default UrlUtil;
