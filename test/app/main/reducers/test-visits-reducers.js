// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import Immutable from 'immutable';
import configureStore from '../../../../app/main/store/store';
import * as profileCommands from '../../../../app/shared/profile-commands';

describe('Action - Default', () => {
  beforeEach(function() {
    this.store = configureStore();
    this.getState = () => this.store.getState().visits;
    this.dispatch = this.store.dispatch;
  });

  it('Should have expected default state', function() {
    const state = this.getState();
    expect(Immutable.List.isList(state)).toEqual(true);
    expect(state.count()).toEqual(0);
  });

  it('Should append visits', function() {
    const { getState, dispatch } = this;
    expect(getState().count()).toEqual(0);

    dispatch(profileCommands.visited('http://test.com'));
    expect(getState().toJS()).toEqual(['http://test.com']);

    dispatch(profileCommands.visited('http://test.com'));
    expect(getState().toJS()).toEqual(['http://test.com', 'http://test.com']);

    dispatch(profileCommands.visited('http://example.com'));
    expect(getState().toJS()).toEqual(['http://test.com', 'http://test.com', 'http://example.com']);
  });
});
