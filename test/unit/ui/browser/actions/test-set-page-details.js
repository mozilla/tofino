/* @flow */

// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import { createBrowserStore } from '../../../../../app/ui/browser/store';
import * as actions from '../../../../../app/ui/browser/actions/main-actions';
import * as selectors from '../../../../../app/ui/browser/selectors';

describe('Action - SET_PAGE_DETAILS', () => {
  beforeEach(function() {
    this.store = createBrowserStore();
    this.getPages = () => selectors.getPages(this.store.getState());
    this.dispatch = this.store.dispatch;

    const { dispatch } = this;
    dispatch(actions.createTab());
    dispatch(actions.createTab('http://moz1.org'));
    dispatch(actions.createTab('http://moz2.org'));
    dispatch(actions.createTab('http://moz3.org'));

    const ids = this.getPages().map(p => p.id);

    dispatch(actions.closeTab(ids.get(0)));
    dispatch(actions.setPageDetails(ids.get(1), {
      title: 'moz1',
    }));
    dispatch(actions.setPageDetails(ids.get(2), {
      title: 'moz2',
    }));
    dispatch(actions.setPageDetails(ids.get(3), {
      title: 'moz3',
    }));
    dispatch(actions.setCurrentTab(ids.get(1)));
  });

  it('Should update page values', function() {
    const { dispatch, getPages } = this;

    dispatch(actions.setPageDetails(getPages().get(1).id, {
      title: 'Mozzerella Firefox',
    }));
    expect(getPages().get(1).title).toEqual('Mozzerella Firefox');
  });

  it('Cannot add new properties to a Page', function() {
    const { dispatch, getPages } = this;

    try {
      dispatch(actions.setPageDetails(getPages().get(2).id, {
        myVerySpecialProperty: 'Well, hello',
      }));
      expect(false).toEqual(true,
        'setPageDetails with an unknown property should throw');
    } catch (e) {
      expect(true).toEqual(true,
        'setPageDetails with an unknown property should throw');
    }
    expect(getPages().get(2).myVerySpecialProperty).toEqual(undefined);
  });
});
