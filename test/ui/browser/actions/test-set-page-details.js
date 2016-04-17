// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import 'babel-polyfill';
import 'babel-register';

import expect from 'expect';
import configureStore from '../../../../ui/browser/store/store';
import * as actions from '../../../../ui/browser/actions/main-actions';

describe('Action - SET_PAGE_DETAILS', () => {
  beforeEach(function() {
    this.store = configureStore();
    const { dispatch } = this.store;
    dispatch(actions.createTab('http://moz1.org'));
    dispatch(actions.createTab('http://moz2.org'));
    dispatch(actions.createTab('http://moz3.org'));
    dispatch(actions.closeTab(0));
    dispatch(actions.setPageDetails(0, {
      title: 'moz1',
    }));
    dispatch(actions.setPageDetails(1, {
      title: 'moz2',
    }));
    dispatch(actions.setPageDetails(2, {
      title: 'moz3',
    }));
    dispatch(actions.setCurrentTab(0));
  });

  it('Should update page values', function() {
    const { dispatch, getState } = this.store;

    dispatch(actions.setPageDetails(1, {
      title: 'Mozzerella Firefox',
      isBookmarked: true,
    }));
    expect(getState().pages.get(1).title).toEqual('Mozzerella Firefox');
    expect(getState().pages.get(1).isBookmarked).toEqual(true);
  });

  it('Should do nothing if page does not exist', function() {
    const { dispatch, getState } = this.store;

    dispatch(actions.setPageDetails(10, {
      title: 'Mozzerella Firefox',
    }));
    expect(getState().pages.get(0).title).toEqual('moz1');
    expect(getState().pages.get(1).title).toEqual('moz2');
    expect(getState().pages.get(2).title).toEqual('moz3');
  });

  it('Cannot add new properties to a Page', function() {
    const { dispatch, getState } = this.store;

    try {
      dispatch(actions.setPageDetails(2, {
        myVerySpecialProperty: 'Well, hello',
      }));
      expect(false).toEqual(true,
        'setPageDetails with an unknown property should throw');
    } catch (e) {
      expect(true).toEqual(true,
        'setPageDetails with an unknown property should throw');
    }
    expect(getState().pages.get(2).myVerySpecialProperty).toEqual(void 0);
  });

  it('Should modify the currently selected page if index `-1` given', function() {
    const { dispatch, getState } = this.store;

    expect(getState().currentPageIndex).toEqual(0);
    dispatch(actions.setPageDetails(-1, {
      title: 'Mozzerella Firefox',
    }));
    expect(getState().pages.get(0).title).toEqual('Mozzerella Firefox');
    expect(getState().pages.get(1).title).toEqual('moz2');
    expect(getState().pages.get(2).title).toEqual('moz3');

    dispatch(actions.setCurrentTab(2));
    dispatch(actions.setPageDetails(-1, {
      title: 'pasta pasta pasta',
    }));
    expect(getState().pages.get(0).title).toEqual('Mozzerella Firefox');
    expect(getState().pages.get(1).title).toEqual('moz2');
    expect(getState().pages.get(2).title).toEqual('pasta pasta pasta');
  });

  it('only allows numbered `pageIndex`', function() {
    const { dispatch } = this.store;

    ([null, void 0, '-1', '1', {}]).forEach(val => {
      try {
        dispatch(actions.setPageDetails(val, { title: 'New Tab!' }));
        expect(false).toEqual(true,
          `setPageDetails with a non-number pageIndex should throw: ${val}`);
      } catch (e) {
        expect(true).toEqual(true,
          `setPageDetails with a non-number pageIndex should throw: ${val}`);
      }
    });
  });
});
