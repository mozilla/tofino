// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import React from 'react';
import { shallow } from 'enzyme';
import requireDir from 'require-dir';

// This test goes through all the widget components and makes sure they all
// consistently behave in a certain way (e.g. making sure they extend styles
// by spreading `style` props). Some components require props that are
// irrelevant for this test, but would cause react's prop type validator
// to warn. They are defined here.
const RequiredProps = {
  Btn: {
    clickHandler: () => {},
    title: 'my title',
  },
};

describe('widgets', () => {
  const exports = requireDir('../../../../app/ui/browser/widgets');
  const components = Object.entries(exports).map(([, value]) => value.default);

  // Make sure you assign react components to a variable starting with an
  // uppercase letter, to express in jsx the fact that a dynamic component
  // needs to be rendered.

  for (const Widget of components) {
    it(`${Widget.displayName} should be a default export and properly render`, () => {
      const wrapper = shallow(<Widget {...RequiredProps[Widget.displayName]} />);
      expect(wrapper.unrendered.type.displayName).toEqual(Widget.displayName);
    });
  }

  for (const Widget of components) {
    it(`${Widget.displayName} should extend style if given`, () => {
      const wrapper = shallow(
        <Widget {...RequiredProps[Widget.displayName]}
          style={{
            foo: 'bar',
          }} />);

      expect(wrapper.prop('style')).toContain({
        foo: 'bar',
      });
    });
  }
});
