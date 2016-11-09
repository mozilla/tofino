// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';

import reducer from '../../../../app/ui/browser-modern/reducers/ui';
import * as ActionTypes from '../../../../app/ui/browser-modern/constants/action-types';
import * as UISelectors from '../../../../app/ui/browser-modern/selectors/ui';
import State from '../../../../app/ui/browser-modern/model';

describe('ui selectors', () => {
  let state;

  beforeEach(() => {
    state = new State();
  });

  it('should have a proper implementation for `getActiveElement`', () => {
    expect(UISelectors.getActiveElement(state)).toEqual(state.ui.activeElement);
  });

  it('should have a proper implementation for `getStatusText`', () => {
    expect(UISelectors.getStatusText(state)).toEqual(state.ui.statusText);
  });

  it('should have a proper implementation for `getOverviewVisible`', () => {
    expect(UISelectors.getOverviewVisible(state)).toEqual(state.ui.overviewVisible);
  });

  it('should have a proper implementation for `getLocationAutocompletions`', () => {
    const preparation = {
      type: ActionTypes.SET_LOCATION_AUTOCOMPLETIONS,
      pageId: 'foo',
      autocompletions: [{ url: 'foo', title: 'bar' }],
    };
    state.set('ui', reducer(state.ui, preparation));
    expect(UISelectors.getLocationAutocompletions(state, preparation.pageId))
      .toEqual(state.ui.locationAutocompletions.get(preparation.pageId));
  });
});
