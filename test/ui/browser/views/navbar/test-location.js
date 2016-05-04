// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import React from 'react';
import { shallow } from 'enzyme';

import { Location } from '../../../../../app/ui/browser/views/navbar/location';
import { Page, Profile } from '../../../../../app/ui/browser/model/index';
import Immutable from 'immutable';

function createSpyProps() {
  return {
    page: new Page(),
    userTypedLocation: '',
    profile: new Profile(),
    onLocationChange: expect.createSpy(),
    onLocationContextMenu: expect.createSpy(),
    onLocationReset: expect.createSpy(),
    isBookmarked: expect.createSpy(),
    bookmark: expect.createSpy(),
    unbookmark: expect.createSpy(),
    ipcRenderer: Object.create(null),
    navigateTo: expect.createSpy(),
  };
}

describe('Location', () => {
  describe('Location', () => {
    it('should render the empty case', () => {
      const props = createSpyProps();
      const wrapper = shallow(
        <Location {...props} />
      );

      expect(wrapper.find('#browser-location-bar').length).toEqual(1);
      expect(wrapper.find('#browser-location-title-bar').length).toEqual(1);
      expect(wrapper.find('#urlbar-input').length).toEqual(1);
    });
  });

  describe('Completions', () => {
    it('should not render when there are no matching completions', () => {
      const props = createSpyProps();
      props.page.set('location', 'https://mozilla.com');
      props.userTypedLocation = 'moz';
      props.profile = props.profile.set('completions', Immutable.Map({
        moz: [],
      }));

      const wrapper = shallow(
        <Location {...props} />
      );

      wrapper.setState({ showURLBar: true, focusedURLBar: true });
      expect(wrapper.find('#autocomplete-results').length).toEqual(0);
    });

    it('should not render when the location is exactly the same as the URL', () => {
      const props = createSpyProps();
      props.page.set('location', 'https://mozilla.com');
      props.userTypedLocation = 'https://mozilla.com';
      props.profile = props.profile.set('completions', Immutable.Map({
        'https://mozilla.com': ['https://mozilla.com'],
      }));

      const wrapper = shallow(
        <Location {...props} />
      );

      wrapper.setState({ showURLBar: true, focusedURLBar: true });
      expect(wrapper.find('#autocomplete-results').length).toEqual(0);
    });

    it('should render completions', () => {
      const props = createSpyProps();
      props.userTypedLocation = 'moz';
      props.profile = props.profile.set('completions', Immutable.Map({
        moz: ['https://mozilla.com', 'https://mozilla.org'],
      }));

      const wrapper = shallow(
        <Location {...props} />
      );

      wrapper.setState({ showURLBar: true, focusedURLBar: true });
      expect(wrapper.find('#autocomplete-results').length).toEqual(1);
      expect(wrapper.find('#autocomplete-results').childAt(0).text()).toEqual('https://mozilla.com');
      expect(wrapper.find('#autocomplete-results').childAt(1).text()).toEqual('https://mozilla.org');
    });
  });
});
