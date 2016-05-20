// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import React from 'react';
import { shallow } from 'enzyme';
import Immutable from 'immutable';

import TabBar from '../../../../../../app/ui/browser/views/tabbar/tabbar';
import { Page } from '../../../../../../app/ui/browser/model/index';

/**
 * The tab handler methods are executed immediately with the page id
 * and return a function returning the true handler we want.
 */
function spyFactory() {
  const spy = expect.createSpy();
  return () => spy;
}

function createSpyProps() {
  return {
    pages: new Immutable.List([
      new Page(),
      new Page(),
      new Page(),
    ]),
    currentPageIndex: 1,
    handleNewTabClick: expect.createSpy(),
    handleTabClick: spyFactory(),
    handleTabClose: spyFactory(),
    handleTabContextMenu: spyFactory(),
  };
}

describe('TabBar', () => {
  it('tabs are created for each page', () => {
    const props = createSpyProps();
    const wrapper = shallow(<TabBar {...props} />).find('Tab');
    expect(wrapper.length).toEqual(3);
  });

  it('calls new tab handler on click', () => {
    const props = createSpyProps();
    const wrapper = shallow(<TabBar {...props} />).find('#new-tab').shallow();
    wrapper.simulate('click');
    expect(props.handleNewTabClick).toHaveBeenCalled();
  });
});
