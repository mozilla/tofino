// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import React from 'react';
import { shallow } from 'enzyme';

import NavBar from '../../../../../ui/browser/views/navbar/navbar.jsx';
import { Page } from '../../../../../ui/browser/model/index';

function createSpyProps() {
  return {
    page: expect.createSpy(),
    ipcRenderer: Object.create(null),
    navBack: expect.createSpy(),
    navForward: expect.createSpy(),
    navRefresh: expect.createSpy(),
    minimize: expect.createSpy(),
    maximize: expect.createSpy(),
    close: expect.createSpy(),
    openMenu: expect.createSpy(),
    bookmark: expect.createSpy(),
    unbookmark: expect.createSpy(),
    onLocationChange: expect.createSpy(),
    onLocationContextMenu: expect.createSpy(),
    onLocationReset: expect.createSpy(),
  };
}

describe('NavBar', function() {
  describe('NavBar', function() {
    it('should render the empty case', function() {
      let props = createSpyProps();
      delete props.page;
      const wrapper = shallow(
        <NavBar {...props} />
      );

      expect(wrapper.html()).toEqual('<div id="browser-navbar"></div>');
    });
  });

  describe('Menu button', function() {
    it('calls handler');
  });
  describe('Back button', function() {
    it('calls handler');
    it('is disabled if page cannot go back');
    it('is not disabled if page can go back');
  });
  describe('Forward button', function() {
    it('calls handler');
    it('is disabled if page cannot go forward');
    it('is not disabled if page can go forward');
  });
  describe('Refresh button', function() {
    it('calls handler');
    it('is disabled if page cannot be refreshed');
    it('is not disabled if page can be refreshed');
  });
  describe('Pages button', function() {
    it('calls handler');
    it('has correct page count');
  });
  describe('Minimize button ', function() {
    it('calls handler');
  });
  describe('Maximize button ', function() {
    it('calls handler');
  });
  describe('Close button ', function() {
    it('calls handler');
  });
});
