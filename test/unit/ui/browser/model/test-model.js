// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import { Page } from '../../../../../app/ui/browser-blueprint/model/index';
import { isUUID } from '../../../../../app/ui/shared/util/uuid-util';

describe('Data model: Page', () => {
  it('should get a UUID upon creation', () => {
    const page = new Page();
    expect(isUUID(page.id)).toBe(true);
  });

  it('should handle locations', () => {
    const page1 = new Page();
    expect(page1.location).toEqual(undefined);
    expect(page1.title).toEqual('New Tab');

    const page2 = new Page({ location: 'https://www.mozilla.org' });
    expect(page2.location).toEqual('https://www.mozilla.org');
    expect(page2.title).toEqual('New Tab');
  });
});
