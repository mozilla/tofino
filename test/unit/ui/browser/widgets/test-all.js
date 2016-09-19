// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import Immutable from 'immutable';
import React, { Component } from 'react';

import expect from 'expect';
import { shallow, render } from 'enzyme';
import requireDir from 'require-dir';

class Minimal extends Component {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    return <div>{'foo'}</div>;
  }
}

Minimal.displayName = 'Minimal';


// This test goes through all the widget components and makes sure they all
// consistently behave in a certain way (e.g. making sure they extend styles
// by spreading `style` props). Some components require props that are
// irrelevant for this test, but would cause react's prop type validator
// to warn. They are defined here.
const RequiredProps = {
  Btn: {
    onClick: () => {},
    title: 'my title',
  },
  FittedImage: {
    src: 'url()',
    mode: 'cover',
    width: '100px',
    height: '200px',
  },
  AutocompletedSearch: {
    dataSrc: Immutable.List(),
    childComponent: Minimal,
    onAutocompletionPick: () => {},
  },
  DropdownMenuBtn: {
    dataSrc: Immutable.List(),
    childComponent: Minimal,
    onMenuItemPick: () => {},
  },
  SelectionList: {
    selectedIndex: 0,
  },
};

const DOMGetters = {
  AutocompletedSearch: e => e.find('.widget-search'),
  DropdownMenuBtn: e => e.find('.widget-btn'),
  SelectionList: e => e.find('.widget-list'),
  Btn: e => e.find('.widget-btn'),
  FittedImage: e => e.find('.widget-fitted-image'),
  ListItem: e => e.find('.widget-list-item'),
  List: e => e.find('.widget-list'),
  Search: e => e.find('.widget-search'),
  Thumbnail: e => e.find('.widget-thumbnail'),
  VerticalSeparator: e => e.find('.widget-vseparator'),
  SpinnerBlue: e => e.find('.widget-spinner'),
  SpinnerGray: e => e.find('.widget-spinner'),
  WarningIcon: e => e.find('.widget-warning-icon'),
};

describe('widgets', () => {
  const exports = requireDir('../../../../../app/ui/shared/widgets');
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
    it(`${Widget.displayName} should pass in the id and/or className if given`, () => {
      const wrapper = render(
        <Widget {...RequiredProps[Widget.displayName]}
          id="foo-id"
          className="bar-class" />);

      expect(DOMGetters[Widget.displayName](wrapper).prop('id')).toEqual('foo-id');
      expect(DOMGetters[Widget.displayName](wrapper).prop('class')).toMatch(/bar-class/);
    });
  }

  for (const Widget of components) {
    it(`${Widget.displayName} should pass in 'hidden' if given`, () => {
      const wrapper = render(
        <Widget {...RequiredProps[Widget.displayName]}
          hidden />);

      expect(DOMGetters[Widget.displayName](wrapper).prop('hidden')).toEqual(true);
    });
  }

  for (const Widget of components) {
    it(`${Widget.displayName} should pass in data-* props if given`, () => {
      const wrapper = render(
        <Widget {...RequiredProps[Widget.displayName]}
          data-foo="bar" />);

      expect(DOMGetters[Widget.displayName](wrapper).prop('data-foo')).toEqual('bar');
    });
  }

  for (const Widget of components) {
    it(`${Widget.displayName} should extend style if given`, () => {
      const wrapper = render(
        <Widget {...RequiredProps[Widget.displayName]}
          style={{
            foo: 'bar',
          }} />);

      expect(DOMGetters[Widget.displayName](wrapper).prop('style')).toContain({
        foo: 'bar',
      });
    });
  }
});
