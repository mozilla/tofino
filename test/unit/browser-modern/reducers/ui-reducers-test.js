// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import Immutable from 'immutable';

import reducer from '../../../../app/ui/browser-modern/reducers/ui';
import * as ActionTypes from '../../../../app/ui/browser-modern/constants/action-types';
import UIState from '../../../../app/ui/browser-modern/model/ui';
import ActiveElement from '../../../../app/ui/browser-modern/model/active-element';
import LocationAutocompletion from '../../../../app/ui/browser-modern/model/location-autocompletion';

describe('ui reducers', () => {
  let state;

  beforeEach(() => {
    state = new UIState();
  });

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(state);
  });

  it('should handle SET_ACTIVE_ELEMENT with `owner` and `details`', () => {
    const action = {
      type: ActionTypes.SET_ACTIVE_ELEMENT,
      owner: 'foo',
      details: 'bar',
    };
    expect(reducer(state, action)).toEqual(state.set('activeElement', new ActiveElement({
      owner: action.owner,
      ...action.details,
    })));
  });

  it('should handle SET_ACTIVE_ELEMENT with no `owner` or `details`', () => {
    const preparation = {
      type: ActionTypes.SET_ACTIVE_ELEMENT,
      owner: 'foo',
      details: 'bar',
    };
    const action = {
      type: ActionTypes.SET_ACTIVE_ELEMENT,
    };
    state = reducer(state, preparation);
    expect(reducer(state, action)).toEqual(state.set('activeElement', null));
  });

  it('should handle SET_STATUS_TEXT', () => {
    const action = {
      type: ActionTypes.SET_STATUS_TEXT,
      statusText: 'foo',
    };
    expect(reducer(state, action)).toEqual(state.set('statusText', action.statusText));
  });

  it('should handle SET_OVERVIEW_VISIBILITY with `true`', () => {
    const action = {
      type: ActionTypes.SET_OVERVIEW_VISIBILITY,
      visibility: true,
    };
    expect(reducer(state, action)).toEqual(state.set('overviewVisible', action.visibility));
  });

  it('should handle SET_OVERVIEW_VISIBILITY with `false`', () => {
    const action = {
      type: ActionTypes.SET_OVERVIEW_VISIBILITY,
      visibility: false,
    };
    expect(reducer(state, action)).toEqual(state.set('overviewVisible', action.visibility));
  });

  it('should handle CREATE_PAGE', () => {
    const action = {
      type: ActionTypes.CREATE_PAGE,
    };
    expect(reducer(state, action)).toEqual(state.set('overviewVisible', false));
  });

  it('should handle SET_SELECTED_PAGE', () => {
    const action = {
      type: ActionTypes.SET_SELECTED_PAGE,
    };
    expect(reducer(state, action)).toEqual(state.set('overviewVisible', false));
  });

  it('should handle SET_LOCATION_AUTOCOMPLETIONS', () => {
    const action = {
      type: ActionTypes.SET_LOCATION_AUTOCOMPLETIONS,
      pageId: 'foo',
      autocompletions: [{ url: 'foo', title: 'bar' }],
    };
    const records = Immutable.List(action.autocompletions.map(e => new LocationAutocompletion(e)));
    expect(reducer(state, action)).toEqual(state.setIn(['locationAutocompletions', action.pageId], records));
  });

  it('should handle SET_LOCATION_AUTOCOMPLETIONS with null array', () => {
    const preparation = {
      type: ActionTypes.SET_LOCATION_AUTOCOMPLETIONS,
      pageId: 'foo',
      autocompletions: [{ url: 'foo', title: 'bar' }],
    };
    const action = {
      type: ActionTypes.SET_LOCATION_AUTOCOMPLETIONS,
      pageId: 'foo',
      autocompletions: null,
    };
    state = reducer(state, preparation);
    expect(reducer(state, action)).toEqual(state.deleteIn(['locationAutocompletions', action.pageId]));
  });

  it('should handle SET_LOCATION_AUTOCOMPLETIONS with empty array', () => {
    const preparation = {
      type: ActionTypes.SET_LOCATION_AUTOCOMPLETIONS,
      pageId: 'foo',
      autocompletions: [{ url: 'foo', title: 'bar' }],
    };
    const action = {
      type: ActionTypes.SET_LOCATION_AUTOCOMPLETIONS,
      pageId: 'foo',
      autocompletions: [],
    };
    state = reducer(state, preparation);
    expect(reducer(state, action)).toEqual(state.deleteIn(['locationAutocompletions', action.pageId]));
  });
});
