// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';

import * as UIActions from '../../../../app/ui/browser-modern/actions/ui-actions';
import * as ActionTypes from '../../../../app/ui/browser-modern/constants/action-types';

describe('ui actions', () => {
  it('should have a proper implementation for `setActiveElement`', () => {
    const owner = 'foo';
    const details = 'bar';
    expect(UIActions.setActiveElement(owner, details)).toEqual({
      type: ActionTypes.SET_ACTIVE_ELEMENT,
      owner,
      details,
    });
  });

  it('should have a proper implementation for `setStatusText`', () => {
    const statusText = 'foo';
    expect(UIActions.setStatusText(statusText)).toEqual({
      type: ActionTypes.SET_STATUS_TEXT,
      statusText,
    });
  });

  it('should have a proper implementation for `showOverview`', () => {
    expect(UIActions.showOverview()).toEqual({
      type: ActionTypes.SET_OVERVIEW_VISIBILITY,
      visibility: true,
    });
  });

  it('should have a proper implementation for `hideOverview`', () => {
    expect(UIActions.hideOverview()).toEqual({
      type: ActionTypes.SET_OVERVIEW_VISIBILITY,
      visibility: false,
    });
  });

  it('should have a proper implementation for `setLocationAutocompletions`', () => {
    const pageId = 'foo';
    const autocompletions = ['bar'];
    expect(UIActions.setLocationAutocompletions(pageId, autocompletions)).toEqual({
      type: ActionTypes.SET_LOCATION_AUTOCOMPLETIONS,
      pageId,
      autocompletions,
    });
  });
});
