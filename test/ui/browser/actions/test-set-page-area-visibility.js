// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import configureStore from '../../../../app/ui/browser/store/store';
import * as actions from '../../../../app/ui/browser/actions/main-actions';
import * as selectors from '../../../../app/ui/browser/selectors';

describe('Action - SET_PAGE_AREA_VISIBILITY', () => {
  beforeEach(function() {
    this.store = configureStore();
    this.getPageAreaVisible = () => selectors.getPageAreaVisible(this.store.getState());
    this.dispatch = this.store.dispatch;
  });

  it('Should set pageAreaVisible', function() {
    const { getPageAreaVisible, dispatch } = this;

    dispatch(actions.setPageAreaVisibility(true));
    expect(getPageAreaVisible()).toEqual(true);
    dispatch(actions.setPageAreaVisibility(true));
    expect(getPageAreaVisible()).toEqual(true);

    dispatch(actions.setPageAreaVisibility(false));
    expect(getPageAreaVisible()).toEqual(false);
    dispatch(actions.setPageAreaVisibility(false));
    expect(getPageAreaVisible()).toEqual(false);

    dispatch(actions.setPageAreaVisibility(true));
    expect(getPageAreaVisible()).toEqual(true);
  });
});
