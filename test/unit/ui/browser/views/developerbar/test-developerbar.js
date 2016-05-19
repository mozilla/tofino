// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import React from 'react';
import { shallow } from 'enzyme';

import DeveloperBar from '../../../../../../app/ui/browser/views/developerbar.jsx';
import Btn from '../../../../../../app/ui/browser/widgets/btn';

describe('components - DeveloperBar', () => {
  it('should not render when in production mode', () => {
    const wrapper = shallow(
      <DeveloperBar />
    );
    expect(wrapper.html()).toEqual(null);
  });

  it('should render when in development mode', () => {
    const wrapper = shallow(
      <DeveloperBar buildConfig={{ development: true }} />
    );
    expect(wrapper.html()).toNotEqual(null);
  });

  it('should have only one button (for now)', () => {
    const wrapper = shallow(
      <DeveloperBar buildConfig={{ development: true }} />
    );
    expect(wrapper.find(Btn).length).toEqual(1);
    expect(wrapper.find('#profile-button')).toNotEqual(null);
  });
});
