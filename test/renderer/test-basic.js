// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/
/* eslint prefer-arrow-callback: 0 */
/* eslint no-undef: 0 */

import expect from 'expect';

describe('renderer - basic', function() {
  it('renders things', async function() {
    expect($$('#browser-tabbar .tab').length).toBe(1);
    expect($('#browser-location-title-bar').hasAttribute('hidden')).toBe(false);
  });
});
