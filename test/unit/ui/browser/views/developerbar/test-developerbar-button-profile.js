// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import React from 'react';
import { shallow } from 'enzyme';

import DeveloperBar from '../../../../../../app/ui/browser/views/window/developerbar.jsx';
import Btn from '../../../../../../app/ui/shared/widgets/btn';

describe('components - DeveloperBar', () => {
  it('should have profile button ready to record', () => {
    const wrapper = shallow(
      <DeveloperBar buildConfig={{ development: true }} />
    );

    expect(wrapper.find(Btn).prop('title')).toEqual('Start Recording');
  });

  it('should have profile button able to record', () => {
    const handleProfileToggle = expect.createSpy();
    const perfStart = expect.createSpy();
    const perfStop = expect.createSpy();

    const wrapper = shallow(
      <DeveloperBar buildConfig={{ development: true }}
        onProfileToggle={handleProfileToggle}
        perfStart={perfStart}
        perfStop={perfStop} />
    );

    wrapper.find('#record-button').simulate('click');
    expect(handleProfileToggle.calls.length).toBe(1);
    expect(perfStart).toHaveBeenCalled();
    expect(perfStop).toNotHaveBeenCalled();
    expect(wrapper.find(Btn).prop('title')).toEqual('Stop Recording');

    wrapper.find('#record-button').simulate('click');
    expect(handleProfileToggle.calls.length).toBe(2);
    expect(perfStart.calls.length).toBe(1);
    expect(perfStop.calls.length).toBe(1);
    expect(wrapper.find(Btn).prop('title')).toEqual('Start Recording');
  });
});
