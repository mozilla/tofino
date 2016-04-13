// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import React from 'react';
import { shallow } from 'enzyme';

import Tab from '../../../../../ui/browser/views/tabbar/tab.jsx';
import { Page } from '../../../../../ui/browser/model/index';

describe('components - NavBar', () => {
  it('should render the basic case', () => {
    const page = new Page({
      location: 'https://www.mozilla.org',
      title: 'Mozilla Home',
    });
    const onClick = expect.createSpy();

    const wrapper = shallow(
      <Tab isActive
        page={page}
        onClose={expect.createSpy()}
        onDragStart={expect.createSpy()}
        onDragEnd={expect.createSpy()}
        onDragEnter={expect.createSpy()}
        onDrop={expect.createSpy()}
        onClick={onClick}
        onContextMenu={expect.createSpy()} />
    );

    expect(wrapper.html()).toEqual(
      '<div class="active" draggable="true" title="Mozilla Home">' +
        '<span>Mozilla Home</span>' +
        '<a><i class="fa fa-close"></i></a>' +
      '</div>');

    wrapper.find('div').simulate('click');
    expect(onClick).toHaveBeenCalled();
  });
});
