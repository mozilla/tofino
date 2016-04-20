// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import configureStore from '../../../../app/ui/browser/store/store';
import * as actions from '../../../../app/ui/browser/actions/main-actions';

describe('Action - SET_PAGE_AREA_VISIBILITY', () => {
  beforeEach(function() {
    this.store = configureStore();
    this.getState = () => this.store.getState().browserWindow;
    this.dispatch = this.store.dispatch;
  });

  it('Should set pageAreaVisible', function() {
    const { getState, dispatch } = this;

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
