// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';

import Page from '../../../../app/ui/browser-modern/model/page';
import PageMeta from '../../../../app/ui/browser-modern/model/page-meta';

describe('Page', () => {
  describe('Page#getTabTitle()', () => {
    it('returns a loading title if a history restore URL', () => {
      const page = new Page({
        title: 'my title',
        meta: new PageMeta({ title: 'Meta Title' }),
        location: 'tofino://historyrestore?url=restoreme',
      });
      expect(page.getTabTitle()).toEqual('Loading…');
    });

    it('returns a title if specified', () => {
      expect(new Page({
        title: 'My Title',
        location: 'https://mozilla.org',
        meta: new PageMeta({ title: 'Meta Title' }),
      }).getTabTitle()).toEqual('My Title');
    });

    it('returns a meta title if no title specified', () => {
      expect(new Page({
        location: 'https://mozilla.org',
        meta: new PageMeta({ title: 'Meta Title' }),
      }).getTabTitle()).toEqual('Meta Title');
    });

    it('returns the location if no title or meta title specified', () => {
      expect(new Page({
        location: 'https://mozilla.org',
      }).getTabTitle()).toEqual('https://mozilla.org');
    });

    it('returns a loading title if no data is specified', () => {
      expect(new Page().getTabTitle()).toEqual('Loading…');
    });
  });
});
