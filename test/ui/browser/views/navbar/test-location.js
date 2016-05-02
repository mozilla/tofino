// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import React from 'react';
import { shallow } from 'enzyme';

import Location from '../../../../../app/ui/browser/views/navbar/location';
import { Page, Profile } from '../../../../../app/ui/browser/model/index';

function createSpyProps() {
  return {
    page: new Page(),
    profile: new Profile(),
    onLocationChange: expect.createSpy(),
    onLocationContextMenu: expect.createSpy(),
    onLocationReset: expect.createSpy(),
    isBookmarked: expect.createSpy(),
    bookmark: expect.createSpy(),
    unbookmark: expect.createSpy(),
    ipcRenderer: Object.create(null),
    navigateTo: expect.createSpy(),
  };
}

describe('Location', () => {
  describe('Location', () => {
    it('should render the empty case', () => {
      const props = createSpyProps();
      const wrapper = shallow(
        <Location {...props} />
      );

      expect(wrapper.find('#browser-location-bar').length).toEqual(1);
      expect(wrapper.find('#browser-location-title-bar').length).toEqual(1);
      expect(wrapper.find('#urlbar-input').length).toEqual(1);
    });
  });
});
