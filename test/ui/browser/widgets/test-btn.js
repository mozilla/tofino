// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import React from 'react';
import { shallow } from 'enzyme';

import Btn from '../../../../app/ui/browser/widgets/btn';

describe('Btn', () => {
  it('sets `id` if given', () => {
    const wrapper = shallow(
      <Btn id={'my-btn'}
        clickHandler={() => {}}
        title={'my title'} />);
    expect(wrapper.prop('id')).toEqual('my-btn');
  });
  it('has `disabled` prop if given', () => {
    const wrapper = shallow(
      <Btn disabled
        clickHandler={() => {}}
        title={'my title'} />);
    expect(wrapper.prop('disabled')).toEqual(true);
  });
  it('does not have `disabled` if not given', () => {
    const wrapper = shallow(
      <Btn title={'my title'}
        clickHandler={() => {}} />
    );
    expect(wrapper.prop('disabled')).toEqual(void 0);
  });
  it('sets `title`', () => {
    const wrapper = shallow(
      <Btn title={'my title'}
        clickHandler={() => {}} />
    );
    expect(wrapper.prop('title')).toEqual('my title');
  });
  it('fires the click handler on click', () => {
    const spy = expect.createSpy();
    const wrapper = shallow(
      <Btn title={'my title'}
        clickHandler={spy} />
    );
    expect(spy).toNotHaveBeenCalled();
    wrapper.simulate('click');
    expect(spy).toHaveBeenCalled();
  });
  it('does not fire the click handler on click when disabled', () => {
    const spy = expect.createSpy();
    const wrapper = shallow(
      <Btn disabled
        title={'my title'}
        clickHandler={spy} />
    );
    expect(spy).toNotHaveBeenCalled();
    wrapper.simulate('click');
    expect(spy).toNotHaveBeenCalled();
  });
  it('sets `image` if given', () => {
    const wrapper = shallow(
      <Btn image={'some-file.svg'}
        clickHandler={() => {}}
        title={'my title'} />
    );
    expect(JSON.stringify(wrapper.prop('style'))).toContain('some-file.svg');
  });
});
