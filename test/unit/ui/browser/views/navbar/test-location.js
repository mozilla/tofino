// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import React from 'react';
import { shallow } from 'enzyme';
import Immutable from 'immutable';

import { Location } from '../../../../../../app/ui/browser/views/navbar/location';
import { LocationCompletionRow } from
  '../../../../../../app/ui/browser/views/navbar/location-completion-row';
import { Page, Profile } from '../../../../../../app/ui/browser/model/index';
import { createBrowserStore } from '../../../../../../app/ui/browser/store';

function createSpyProps(store) {
  const props = {
    dispatch: store.dispatch,
    page: new Page(),
    userTypedLocation: '',
    showCompletions: true,
    profile: new Profile(),
    onLocationChange: expect.createSpy(),
    onLocationContextMenu: expect.createSpy(),
    onLocationReset: expect.createSpy(),
    onClearCompletions: expect.createSpy(),
    showURLBar: false,
    focusedURLBar: false,
    focusedResultIndex: 0,
    isBookmarked: expect.createSpy(),
    bookmark: expect.createSpy(),
    unbookmark: expect.createSpy(),
    ipcRenderer: Object.create(null),
    navigateTo: expect.createSpy(),
  };
  props.pages = Immutable.List([props.page]);
  return props;
}

describe('Location', () => {
  let store;
  let spyProps;

  beforeEach(() => {
    store = createBrowserStore();
    spyProps = createSpyProps(store);
  });

  describe('Location', () => {
    it('should render the empty case', () => {
      const wrapper = shallow(
        <Location {...spyProps} />
      );

      expect(wrapper.find('#browser-location-bar').length).toEqual(1);
      expect(wrapper.find('#browser-location-title-bar').length).toEqual(1);
      expect(wrapper.find('#urlbar-input').length).toEqual(1);
    });
  });

  describe('Completions', () => {
    it('should not render when there are no matching completions', () => {
      spyProps.page.set('location', 'https://mozilla.com');
      spyProps.userTypedLocation = 'moz';
      spyProps.profile = spyProps.profile.set('completions', Immutable.Map({
        moz: [],
      }));

      const wrapper = shallow(
        <Location {...spyProps} />
      );

      wrapper.setProps({ showURLBar: true, focusedURLBar: true });
      expect(wrapper.find('#autocomplete-results').length).toEqual(0);
    });

    it('should not render when the location is exactly the same as the URL', () => {
      spyProps.page.set('location', 'https://mozilla.com/');
      spyProps.userTypedLocation = 'https://mozilla.com/';
      spyProps.profile = spyProps.profile.set('completions', Immutable.Map({
        'https://mozilla.com': [{ title: 'Mozilla.com', uri: 'https://mozilla.com/' }],
      }));

      const wrapper = shallow(
        <Location {...spyProps} />
      );

      wrapper.setProps({ showURLBar: true, focusedURLBar: true });
      expect(wrapper.find('#autocomplete-results').length).toEqual(0);
    });

    it('should render completions', () => {
      spyProps.userTypedLocation = 'moz';
      spyProps.profile = spyProps.profile.set('completions', Immutable.Map({
        moz: [
          { title: 'Mozilla.com', uri: 'https://mozilla.com/' },
          { title: 'Mozilla.org', uri: 'https://mozilla.org/' },
        ],
      }));

      const wrapper = shallow(
        <Location {...spyProps} />
      );

      wrapper.setProps({ showURLBar: true, focusedURLBar: true });

      expect(wrapper.find('#autocomplete-results').length).toEqual(1);
      expect(wrapper.find(LocationCompletionRow).first().shallow()
        .find('.completion-title')
        .text()).toEqual('Mozilla.com');
      expect(wrapper.find(LocationCompletionRow).first().shallow()
        .find('.completion-url')
        .text()).toEqual('mozilla.com/');
      expect(wrapper.find(LocationCompletionRow).last().shallow()
        .find('.completion-title')
        .text()).toEqual('Mozilla.org');
      expect(wrapper.find(LocationCompletionRow).last().shallow()
        .find('.completion-url')
        .text()).toEqual('mozilla.org/');
    });

    it('should reset the selected index when input changes', () => {
      spyProps.userTypedLocation = 'm';
      const wrapper = shallow(
        <Location {...spyProps} />
      );
      spyProps.userTypedLocation = 'mo';
      spyProps.showURLBar = true;
      spyProps.focusedURLBar = true;
      spyProps.focusedResultIndex = 1;
      wrapper.setProps(spyProps);
      expect(store.getState().uiState.focusedResultIndex).toEqual(-1);
    });

    // Pending test due to not being able to use refs in shallow rendering
    // See https://github.com/mozilla/tofino/pull/385.
    it('should set the input value when userTypedLocation changes externally');
  });
});
