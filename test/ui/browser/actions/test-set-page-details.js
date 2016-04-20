// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import configureStore from '../../../../app/ui/browser/store/store';
import * as actions from '../../../../app/ui/browser/actions/main-actions';

describe('Action - SET_PAGE_DETAILS', () => {
  beforeEach(function() {
    this.store = configureStore();
    this.getState = () => this.store.getState().browserWindow;
    this.dispatch = this.store.dispatch;

    const { dispatch } = this;
    dispatch(actions.createTab('http://moz1.org'));
    dispatch(actions.createTab('http://moz2.org'));
    dispatch(actions.createTab('http://moz3.org'));
    dispatch(actions.closeTab(0));
    dispatch(actions.setPageDetails({
      pageIndex: 0,
      title: 'moz1',
    }));
    dispatch(actions.setPageDetails({
      pageIndex: 1,
      title: 'moz2',
    }));
    dispatch(actions.setPageDetails({
      pageIndex: 2,
      title: 'moz3',
    }));
    dispatch(actions.setCurrentTab(0));
  });

  it('Should update page values', function() {
    const { dispatch, getState } = this;

    dispatch(actions.setPageDetails({
      pageIndex: 1,
      title: 'Mozzerella Firefox',
    }));
    expect(getState().pages.get(1).title).toEqual('Mozzerella Firefox');
  });

  it('Should do nothing if page does not exist', function() {
    const { dispatch, getState } = this;

    dispatch(actions.setPageDetails({
      pageIndex: 10,
      title: 'Mozzerella Firefox',
    }));
    expect(getState().pages.get(0).title).toEqual('moz1');
    expect(getState().pages.get(1).title).toEqual('moz2');
    expect(getState().pages.get(2).title).toEqual('moz3');
  });

  it('Cannot add new properties to a Page', function() {
    const { dispatch, getState } = this;

    try {
      dispatch(actions.setPageDetails({
        pageIndex: 2,
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
    const { dispatch, getState } = this;

    expect(getState().currentPageIndex).toEqual(0);
    dispatch(actions.setPageDetails({
      pageIndex: -1,
      title: 'Mozzerella Firefox',
    }));
    expect(getState().pages.get(0).title).toEqual('Mozzerella Firefox');
    expect(getState().pages.get(1).title).toEqual('moz2');
    expect(getState().pages.get(2).title).toEqual('moz3');

    dispatch(actions.setCurrentTab(2));
    dispatch(actions.setPageDetails({
      pageIndex: -1,
      title: 'pasta pasta pasta',
    }));
    expect(getState().pages.get(0).title).toEqual('Mozzerella Firefox');
    expect(getState().pages.get(1).title).toEqual('moz2');
    expect(getState().pages.get(2).title).toEqual('pasta pasta pasta');
  });

  it('only allows numbered `pageIndex`', function() {
    const { dispatch } = this;

    ([null, void 0, '-1', '1', {}]).forEach(val => {
      try {
        dispatch(actions.setPageDetails({
          pageIndex: val,
          title: 'New Tab!',
        }));
        expect(false).toEqual(true,
          `setPageDetails with a non-number pageIndex should throw: ${val}`);
      } catch (e) {
        expect(true).toEqual(true,
          `setPageDetails with a non-number pageIndex should throw: ${val}`);
      }
    });
  });
});
