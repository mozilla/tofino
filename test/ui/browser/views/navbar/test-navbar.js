// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import React from 'react';
import { shallow } from 'enzyme';

import NavBar from '../../../../../ui/browser/views/navbar/navbar.jsx';
import { Page } from '../../../../../ui/browser/model/index.js';

function createSpyProps() {
  return {
    page: new Page(),
    pages: new Set(),
    pageAreaVisible: false,
    ipcRenderer: Object.create(null),
    navBack: expect.createSpy(),
    navForward: expect.createSpy(),
    navRefresh: expect.createSpy(),
    minimize: expect.createSpy(),
    maximize: expect.createSpy(),
    close: expect.createSpy(),
    openMenu: expect.createSpy(),
    isBookmarked: expect.createSpy(),
    bookmark: expect.createSpy(),
    unbookmark: expect.createSpy(),
    onLocationChange: expect.createSpy(),
    onLocationContextMenu: expect.createSpy(),
    onLocationReset: expect.createSpy(),
    setPageAreaVisibility: expect.createSpy(),
  };
}

describe('NavBar', () => {
  describe('NavBar', () => {
    it('should render the empty case', () => {
      const props = createSpyProps();
      delete props.page;
      const wrapper = shallow(
        <NavBar {...props} />
      );

      expect(wrapper.html()).toEqual('<div id="browser-navbar"></div>');
    });
  });

  describe('Menu button', () => {
    it('calls handler on click', () => {
      const props = createSpyProps();
      props.openMenu = expect.createSpy();
      const wrapper = shallow(<NavBar {...props} />).find('#browser-navbar-menu').shallow();
      wrapper.simulate('click');
      expect(props.openMenu).toHaveBeenCalled();
    });
  });

  describe('Back button', () => {
    it('is disabled if page cannot go back', () => {
      const props = createSpyProps();
      props.page = new Page({ canGoBack: false });
      const wrapper = shallow(<NavBar {...props} />).find('#browser-navbar-back').shallow();
      expect(wrapper.prop('disabled')).toEqual(true);
      wrapper.simulate('click');
      expect(props.navBack).toNotHaveBeenCalled();
    });
    it('is not disabled if page can go back', () => {
      const props = createSpyProps();
      props.page = new Page({ canGoBack: true });
      const wrapper = shallow(<NavBar {...props} />).find('#browser-navbar-back').shallow();
      expect(wrapper.prop('disabled')).toEqual(false);
      wrapper.simulate('click');
      expect(props.navBack).toHaveBeenCalled();
    });
  });

  describe('Forward button', () => {
    it('is disabled if page cannot go forward', () => {
      const props = createSpyProps();
      props.page = new Page({ canGoForward: false });
      const wrapper = shallow(<NavBar {...props} />).find('#browser-navbar-forward').shallow();
      expect(wrapper.prop('disabled')).toEqual(true);
      wrapper.simulate('click');
      expect(props.navForward).toNotHaveBeenCalled();
    });
    it('is not disabled if page can go forwardd', () => {
      const props = createSpyProps();
      props.page = new Page({ canGoForward: true });
      const wrapper = shallow(<NavBar {...props} />).find('#browser-navbar-forward').shallow();
      expect(wrapper.prop('disabled')).toEqual(false);
      wrapper.simulate('click');
      expect(props.navForward).toHaveBeenCalled();
    });
  });
  describe('Refresh button', () => {
    it('is disabled if page cannot be refreshed', () => {
      const props = createSpyProps();
      props.page = new Page({ canRefresh: false });
      const wrapper = shallow(<NavBar {...props} />).find('#browser-navbar-refresh').shallow();
      expect(wrapper.prop('disabled')).toEqual(true);
      wrapper.simulate('click');
      expect(props.navRefresh).toNotHaveBeenCalled();
    });
    it('is not disabled if page can be refreshed', () => {
      const props = createSpyProps();
      props.page = new Page({ canRefresh: true });
      const wrapper = shallow(<NavBar {...props} />).find('#browser-navbar-refresh').shallow();
      expect(wrapper.prop('disabled')).toEqual(false);
      wrapper.simulate('click');
      expect(props.navRefresh).toHaveBeenCalled();
    });
  });
  describe('Pages button', () => {
    it('calls handler');
    it('has correct page count', () => {
      const props = createSpyProps();
      const pages = [new Page(), new Page(), new Page()];
      props.page = pages[0];
      props.pages = new Set([pages[0]]);

      let wrapper = shallow(<NavBar {...props} />);
      expect(wrapper.find('#browser-navbar-pages-count').text()).toEqual('1');

      props.page = pages[1];
      props.pages = new Set(pages);

      wrapper = shallow(<NavBar {...props} />);
      expect(wrapper.find('#browser-navbar-pages-count').text()).toEqual('3');
    });
  });
  describe('Minimize button ', () => {
    it('calls handler', () => {
      const props = createSpyProps();
      const wrapper = shallow(<NavBar {...props} />).find('#browser-navbar-minimize').shallow();
      wrapper.simulate('click');
      expect(props.minimize).toHaveBeenCalled();
    });
  });
  describe('Maximize button ', () => {
    it('calls handler', () => {
      const props = createSpyProps();
      const wrapper = shallow(<NavBar {...props} />).find('#browser-navbar-maximize').shallow();
      wrapper.simulate('click');
      expect(props.maximize).toHaveBeenCalled();
    });
  });
  describe('Close button ', () => {
    it('calls handler', () => {
      const props = createSpyProps();
      const wrapper = shallow(<NavBar {...props} />).find('#browser-navbar-close').shallow();
      wrapper.simulate('click');
      expect(props.close).toHaveBeenCalled();
    });
  });
});
