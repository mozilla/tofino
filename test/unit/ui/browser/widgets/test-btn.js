// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import React from 'react';
import expect from 'expect';
import { shallow } from 'enzyme';

import Btn, * as Const from '../../../../../app/ui/shared/widgets/btn';

describe('Btn', () => {
  const noop = () => {};

  it('sets `id` if given', () => {
    const wrapper = shallow(
      <Btn id="my-btn"
        onClick={noop}
        title="my title" />);
    expect(wrapper.prop('id')).toEqual('my-btn');
  });
  it('sets `className` if given', () => {
    const wrapper = shallow(
      <Btn className="my-btn-cls"
        onClick={noop}
        title="my title" />);
    expect(wrapper.prop('className')).toMatch(/my-btn-cls/);
  });
  it('has `data-active` prop if given', () => {
    const wrapper = shallow(
      <Btn data-active
        onClick={noop}
        title="my title" />);
    expect(wrapper.prop('data-active')).toEqual(true);
  });
  it('does not have `data-active` if not given', () => {
    const wrapper = shallow(
      <Btn title="my title"
        onClick={noop} />
    );
    expect(wrapper.prop('data-active')).toEqual(undefined);
  });
  it('has `disabled` prop if given', () => {
    const wrapper = shallow(
      <Btn disabled
        onClick={noop}
        title="my title" />);
    expect(wrapper.find('button').prop('disabled')).toEqual(true);
  });
  it('does not have `disabled` if not given', () => {
    const wrapper = shallow(
      <Btn title="my title"
        onClick={noop} />
    );
    expect(wrapper.find('button').prop('disabled')).toEqual(undefined);
  });
  it('sets `title`', () => {
    const wrapper = shallow(
      <Btn title="my title"
        onClick={noop} />
    );
    expect(wrapper.find('button').prop('title')).toEqual('my title');
  });
  it('fires the click handler on click', () => {
    const spy = expect.createSpy();
    const wrapper = shallow(
      <Btn title="my title"
        onClick={spy} />
    );
    expect(spy).toNotHaveBeenCalled();
    wrapper.find('button').simulate('click');
    expect(spy).toHaveBeenCalled();
  });
  it('does not fire the click handler on click when disabled', () => {
    const spy = expect.createSpy();
    const wrapper = shallow(
      <Btn disabled
        title="my title"
        onClick={spy} />
    );
    expect(spy).toNotHaveBeenCalled();
    wrapper.find('button').simulate('click');
    expect(spy).toNotHaveBeenCalled();
  });
  it('sets `image` if given', () => {
    const wrapper = shallow(
      <Btn image="some-file.svg"
        onClick={noop}
        title="my title" />
    );
    expect(wrapper.find('button').prop('style')).toContain({
      backgroundImage: 'url(assets/some-file.svg)',
      backgroundRepeat: Const.BKG_REPEAT_DEFAULT,
      backgroundPosition: Const.BKG_POSIITON_DEFAULT,
      backgroundSize: Const.BKG_SIZE_DEFAULT,
    });
  });
  it('sets a default `image` if given a falsy prop', () => {
    const wrapper = shallow(
      <Btn image=""
        onClick={noop}
        title="my title" />
    );
    expect(wrapper.find('button').prop('style')).toContain({
      backgroundImage: `url(${Const.BKG_IMAGE_DEFAULT})`,
      backgroundRepeat: Const.BKG_REPEAT_DEFAULT,
      backgroundPosition: Const.BKG_POSIITON_DEFAULT,
      backgroundSize: Const.BKG_SIZE_DEFAULT,
    });
  });
  it('sets `imgWidth`, `imgHeight` and `imgPosition` if given', () => {
    const wrapper = shallow(
      <Btn image=""
        imgWidth="100px"
        imgHeight="200px"
        imgPosition="center"
        onClick={noop}
        title="my title" />
    );
    expect(wrapper.find('button').prop('style')).toContain({
      backgroundImage: `url(${Const.BKG_IMAGE_DEFAULT})`,
      backgroundRepeat: Const.BKG_REPEAT_DEFAULT,
      backgroundPosition: 'center',
      backgroundSize: '100px 200px',
    });
  });
  it('sets the correct min size based off of `imgWidth` and `imgHeight` if given', () => {
    const wrapper = shallow(
      <Btn image=""
        imgWidth="100px"
        imgHeight="200px"
        onClick={noop}
        title="my title" />
    );
    expect(wrapper.find('button').prop('style')).toContain({
      minWidth: '100px',
      minHeight: '200px',
    });
  });
  it('sets the correct min size based off of `minWidth` and `minHeight` if given', () => {
    const wrapper = shallow(
      <Btn image=""
        minWidth="300px"
        minHeight="400px"
        onClick={noop}
        title="my title" />
    );
    expect(wrapper.find('button').prop('style')).toContain({
      minWidth: '300px',
      minHeight: '400px',
    });
  });
  it('sets the correct min size if given conflicting props', () => {
    const wrapper = shallow(
      <Btn image=""
        imgWidth="100px"
        imgHeight="200px"
        minWidth="300px"
        minHeight="400px"
        onClick={noop}
        title="my title" />
    );
    expect(wrapper.find('button').prop('style')).toContain({
      minWidth: '300px',
      minHeight: '400px',
    });
  });
  it('sets the correct padding when given an image but no children', () => {
    const wrapper = shallow(
      <Btn image=""
        imgWidth="100px"
        imgHeight="200px"
        onClick={noop}
        title="my title" />
    );
    expect(wrapper.find('button').prop('style')).toExclude([
      'paddingLeft',
      'paddingRigth',
    ]);
  });
  it('sets the correct padding when given an image with children', () => {
    const wrapper = shallow(
      <Btn image=""
        imgWidth="100px"
        imgHeight="200px"
        onClick={noop}
        title="my title">
        Test
      </Btn>
    );
    expect(wrapper.find('button').prop('style')).toContain({
      paddingLeft: '105px',
      paddingRight: '0px',
    });
  });
});
