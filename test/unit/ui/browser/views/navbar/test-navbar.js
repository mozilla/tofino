// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import React from 'react';
import { shallow } from 'enzyme';

import NavBar from '../../../../../../app/ui/browser-blueprint/views/navbar';
import { Page } from '../../../../../../app/ui/browser-blueprint/model/index';

function createSpyProps() {
  return {
    page: new Page(),
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

describe('NavBar', () => {
  describe('NavBar', () => {
    it('should render the empty case', () => {
      const props = createSpyProps();
      delete props.page;
      const wrapper = shallow(<NavBar {...props} />);
      expect(wrapper.html()).toMatch(/<div id="browser-navbar" class="[a-z0-9]+?"><\/div>/);
    });
  });

  describe('Back button', () => {
    it('is disabled if page cannot go back', () => {
      const props = createSpyProps();
      props.page = new Page({ canGoBack: false });
      const wrapper = shallow(<NavBar {...props} />
      ).find('#browser-navbar-back').shallow();
      expect(wrapper.find('button').prop('disabled')).toEqual(true);
      wrapper.find('button').simulate('click');
      expect(props.navBack).toNotHaveBeenCalled();
    });
    it('is not disabled if page can go back', () => {
      const props = createSpyProps();
      props.page = new Page({ canGoBack: true });
      const wrapper = shallow(<NavBar {...props} />
      ).find('#browser-navbar-back').shallow();
      expect(wrapper.find('button').prop('disabled')).toEqual(false);
      wrapper.find('button').simulate('click');
      expect(props.navBack).toHaveBeenCalled();
    });
  });

  describe('Forward button', () => {
    it('is disabled if page cannot go forward', () => {
      const props = createSpyProps();
      props.page = new Page({ canGoForward: false });
      const wrapper = shallow(<NavBar {...props} />
      ).find('#browser-navbar-forward').shallow();
      expect(wrapper.find('button').prop('disabled')).toEqual(true);
      wrapper.find('button').simulate('click');
      expect(props.navForward).toNotHaveBeenCalled();
    });
    it('is not disabled if page can go forwardd', () => {
      const props = createSpyProps();
      props.page = new Page({ canGoForward: true });
      const wrapper = shallow(<NavBar {...props} />
      ).find('#browser-navbar-forward').shallow();
      expect(wrapper.find('button').prop('disabled')).toEqual(false);
      wrapper.find('button').simulate('click');
      expect(props.navForward).toHaveBeenCalled();
    });
  });

  describe('Refresh button', () => {
    it('is disabled if page cannot be refreshed', () => {
      const props = createSpyProps();
      props.page = new Page({ canRefresh: false });
      const wrapper = shallow(<NavBar {...props} />
      ).find('#browser-navbar-refresh').shallow();
      expect(wrapper.find('button').prop('disabled')).toEqual(true);
      wrapper.find('button').simulate('click');
      expect(props.navRefresh).toNotHaveBeenCalled();
    });
    it('is not disabled if page can be refreshed', () => {
      const props = createSpyProps();
      props.page = new Page({ canRefresh: true });
      const wrapper = shallow(<NavBar {...props} />
      ).find('#browser-navbar-refresh').shallow();
      expect(wrapper.find('button').prop('disabled')).toEqual(false);
      wrapper.find('button').simulate('click');
      expect(props.navRefresh).toHaveBeenCalled();
    });
  });
});
