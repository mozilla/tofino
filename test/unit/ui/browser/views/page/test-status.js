// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import React from 'react';
import { render } from 'enzyme';

import { Status } from '../../../../../../app/ui/browser/views/page/status';

describe('components - Status', () => {
  it('should render status text when given', () => {
    const wrapper = render(<Status statusText="test" />);
    expect(wrapper.text()).toEqual('test');
    expect(wrapper.find('div')[0].attribs).toNotContain({ hidden: '' });
  });

  it('should hide status when necessary', () => {
    const wrapper = render(<Status statusText="" />);
    expect(wrapper.text()).toEqual('');
    expect(wrapper.find('div')[0].attribs).toContain({ hidden: '' });
  });
});
