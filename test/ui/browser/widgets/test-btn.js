// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import React from 'react';
import { shallow } from 'enzyme';

import Btn, * as Const from '../../../../app/ui/browser/widgets/btn';

describe('Btn', () => {
  it('sets `id` if given', () => {
    const wrapper = shallow(
      <Btn id="my-btn"
        clickHandler={() => {}}
        title="my title" />);
    expect(wrapper.prop('id')).toEqual('my-btn');
  });
  it('sets `className` if given', () => {
    const wrapper = shallow(
      <Btn className="my-btn-cls"
        clickHandler={() => {}}
        title="my title" />);
    expect(wrapper.prop('className')).toMatch(/my-btn-cls/);
  });
  it('has `disabled` prop if given', () => {
    const wrapper = shallow(
      <Btn disabled
        clickHandler={() => {}}
        title="my title" />);
    expect(wrapper.prop('disabled')).toEqual(true);
  });
  it('does not have `disabled` if not given', () => {
    const wrapper = shallow(
      <Btn title="my title"
        clickHandler={() => {}} />
    );
    expect(wrapper.prop('disabled')).toEqual(void 0);
  });
  it('sets `title`', () => {
    const wrapper = shallow(
      <Btn title="my title"
        clickHandler={() => {}} />
    );
    expect(wrapper.prop('title')).toEqual('my title');
  });
  it('fires the click handler on click', () => {
    const spy = expect.createSpy();
    const wrapper = shallow(
      <Btn title="my title"
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
        title="my title"
        clickHandler={spy} />
    );
    expect(spy).toNotHaveBeenCalled();
    wrapper.simulate('click');
    expect(spy).toNotHaveBeenCalled();
  });
  it('sets `image` if given', () => {
    const wrapper = shallow(
      <Btn image="some-file.svg"
        clickHandler={() => {}}
        title="my title" />
    );
    expect(wrapper.prop('style')).toContain({
      backgroundImage: 'url(assets/some-file.svg)',
      backgroundRepeat: Const.BKG_REPEAT_DEFAULT,
      backgroundPosition: Const.BKG_POSIITON_DEFAULT,
      backgroundSize: Const.BKG_SIZE_DEFAULT,
    });
  });
  it('sets a default `image` if given a falsy prop', () => {
    const wrapper = shallow(
      <Btn image=""
        clickHandler={() => {}}
        title="my title" />
    );
    expect(wrapper.prop('style')).toContain({
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
        clickHandler={() => {}}
        title="my title" />
    );
    expect(wrapper.prop('style')).toContain({
      backgroundImage: `url(${Const.BKG_IMAGE_DEFAULT})`,
      backgroundRepeat: Const.BKG_REPEAT_DEFAULT,
      backgroundPosition: 'center',
      backgroundSize: '100px 200px',
    });
  });
});
