// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import configureStore from '../../../../ui/browser/store/store';
import * as actions from '../../../../ui/browser/actions/main-actions';

describe('Action - SET_PAGE_AREA_VISIBILITY', () => {
  beforeEach(function() {
    this.store = configureStore();
  });

  it('Should set pageAreaVisible', function() {
    const { getState, dispatch } = this.store;

    dispatch(actions.setPageAreaVisibility(true));
    expect(getState().pageAreaVisible).toEqual(true);
    dispatch(actions.setPageAreaVisibility(true));
    expect(getState().pageAreaVisible).toEqual(true);

    dispatch(actions.setPageAreaVisibility(false));
    expect(getState().pageAreaVisible).toEqual(false);
    dispatch(actions.setPageAreaVisibility(false));
    expect(getState().pageAreaVisible).toEqual(false);

    dispatch(actions.setPageAreaVisibility(true));
    expect(getState().pageAreaVisible).toEqual(true);
  });
});
