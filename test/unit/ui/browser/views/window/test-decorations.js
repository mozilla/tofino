// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import React from 'react';
import { shallow } from 'enzyme';

import { Decorations } from '../../../../../../app/ui/browser-blueprint/views/window/decorations';

function createSpyProps() {
  return {
    handleOpenMenu: expect.createSpy(),
    handleMinimize: expect.createSpy(),
    handleMaximize: expect.createSpy(),
    handleClose: expect.createSpy(),

    // Needed by <NavBar>
    pages: new Set(),
    navBack: expect.createSpy(),
    navForward: expect.createSpy(),
    navRefresh: expect.createSpy(),
    isBookmarked: expect.createSpy(),
    bookmark: expect.createSpy(),
    unbookmark: expect.createSpy(),
    onLocationChange: expect.createSpy(),
    onLocationContextMenu: expect.createSpy(),
    onLocationReset: expect.createSpy(),
    navigateTo: expect.createSpy(),
  };
}

describe('Window decorations', () => {
  describe('Menu button', () => {
    it('calls handler on click', () => {
      const props = createSpyProps();
      const wrapper = shallow(
        <Decorations {...props} />
      ).find('#browser-menu').shallow();
      wrapper.find('button').simulate('click');
      expect(props.handleOpenMenu).toHaveBeenCalled();
    });
  });

  describe('Minimize button', () => {
    it('calls handler on click', () => {
      const props = createSpyProps();
      const wrapper = shallow(
        <Decorations {...props} />
      ).find('#browser-minimize').shallow();
      wrapper.find('button').simulate('click');
      expect(props.handleMinimize).toHaveBeenCalled();
    });
  });

  describe('Maximize button', () => {
    it('calls handler on click', () => {
      const props = createSpyProps();
      const wrapper = shallow(
        <Decorations {...props} />
      ).find('#browser-maximize').shallow();
      wrapper.find('button').simulate('click');
      expect(props.handleMaximize).toHaveBeenCalled();
    });
  });

  describe('Close button', () => {
    it('calls handler on click', () => {
      const props = createSpyProps();
      const wrapper = shallow(
        <Decorations {...props} />
      ).find('#browser-close').shallow();
      wrapper.find('button').simulate('click');
      expect(props.handleClose).toHaveBeenCalled();
    });
  });
});
