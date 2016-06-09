// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import { waitUntil } from '../utils/async';
import { tabContextFunctions } from '../../app/ui/browser/actions/external';
import * as actions from '../../app/ui/browser/constants/action-types';

describe('renderer - tab context menu', function() {
  it('New Tab fires a CREATE_TAB action', async function() {
    const { store } = window.app;
    const getCreateTabActions = () =>
      store.history.filter(action => action.type === actions.CREATE_TAB);
    const startingCount = getCreateTabActions().length;

    tabContextFunctions.newTab(store.dispatch);

    await waitUntil(() => getCreateTabActions().length === startingCount + 1);
    expect(getCreateTabActions().length).toBeGreaterThan(startingCount);
  });

  it('Close Tab fires a CLOSE_TAB action with correct page index', async function() {
    const { store } = window.app;
    const getCloseTabActions = () =>
      store.history.filter(action => action.type === actions.CLOSE_TAB);
    const startingCount = getCloseTabActions().length;
    const state = store.getState();

    const pageId = state.pages.pages.get(state.pages.currentPageIndex).id;
    expect(typeof pageId).toBe('string');

    tabContextFunctions.closeTab(pageId, store.dispatch);

    await waitUntil(() => {
      const closeActions = getCloseTabActions();
      return closeActions.length === startingCount + 1 &&
             closeActions[closeActions.length - 1].pageId === pageId;
    });
    const closeActions = getCloseTabActions();
    expect(closeActions.length).toBeGreaterThan(startingCount);
    expect(closeActions[closeActions.length - 1].pageId).toBe(pageId);
  });
});
