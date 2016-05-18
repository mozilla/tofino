/* @flow */

// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import configureStore from '../../../../../app/ui/browser/store/store';
import * as actions from '../../../../../app/ui/browser/actions/main-actions';
import * as selectors from '../../../../../app/ui/browser/selectors';

describe('Action - SET_CURRENT_TAB_LEFT, SET_CURRENT_TAB_RIGHT', () => {
  beforeEach(function() {
    this.store = configureStore();
    this.getPages = () => selectors.getPages(this.store.getState());
    this.getCurrentPageIndex = () => selectors.getCurrentPageIndex(this.store.getState());
    this.dispatch = this.store.dispatch;
  });

  it('Should update the current tab', function() {
    const { getCurrentPageIndex, getPages, dispatch } = this;

    dispatch(actions.createTab('http://moz1.com'));
    dispatch(actions.createTab('http://moz2.com'));
    dispatch(actions.createTab('http://moz3.com'));
    expect(getPages().size).toEqual(3);
    expect(getCurrentPageIndex()).toEqual(2);

    dispatch(actions.setCurrentTabPrevious());
    expect(getCurrentPageIndex()).toEqual(1);

    dispatch(actions.setCurrentTabPrevious());
    expect(getCurrentPageIndex()).toEqual(0);

    dispatch(actions.setCurrentTabPrevious());
    expect(getCurrentPageIndex()).toEqual(2, 'Safely handles looping out of bounds leftwards');

    dispatch(actions.setCurrentTabNext());
    expect(getCurrentPageIndex()).toEqual(0, 'Safely handles looping out of bounds rightwards');

    dispatch(actions.setCurrentTabNext());
    expect(getCurrentPageIndex()).toEqual(1);

    dispatch(actions.setCurrentTabNext());
    expect(getCurrentPageIndex()).toEqual(2);
  });
});
