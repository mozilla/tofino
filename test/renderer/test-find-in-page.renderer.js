// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/
/* eslint no-undef: 0 */

import expect from 'expect';
import { waitUntil } from '../utils/async';
import * as actions from '../../app/ui/browser/constants/action-types';
import * as selectors from '../../app/ui/browser/selectors/index';

const fireKeyDown = (ops) => {
  const event = new window.KeyboardEvent('keydown', ops);
  document.body.dispatchEvent(event);
};

const setFocusedURLBar = (dispatch, pageId, focused) => {
  // Make our own dispatch action here since we need to fire the action
  // within the electron renderer context and use the 'dispatch' that's
  // hooked up to the store we're actually testing
  dispatch({
    type: actions.SET_URL_INPUT_FOCUSED,
    pageId,
    payload: { focused },
  });
};

const waitUntilURLBarUnfocused = state =>
  waitUntil(() => !selectors.focusedURLBar(state, selectors.getCurrentPage(state).id));

describe('renderer - find in page', function() {
  before(async function() {
    const { store } = window.app;
    // Ensure URL bar is not focused
    store.getState().pages.pages.forEach(page => setFocusedURLBar(store.dispatch, page.id, false));
    await waitUntilURLBarUnfocused(store.getState());
  });

  it('Slash/Escape fires SET_PAGE_DETAILS with isSearching', async function() {
    const { store } = window.app;

    const getSearchingActions = () =>
      store.history.filter(action =>
        action.type === actions.SET_PAGE_DETAILS && 'isSearching' in action.payload);
    const startingCount = getSearchingActions().length;

    fireKeyDown({ code: 'Slash' });

    await waitUntil(() => getSearchingActions().length === startingCount + 1);

    expect(getSearchingActions()[startingCount].payload.isSearching).toBe(true,
      'Received a SET_PAGE_DETAILS event with { isSearching: true } after "Slash"');

    fireKeyDown({ code: 'Escape' });

    await waitUntil(() => getSearchingActions().length === startingCount + 2);
    expect(getSearchingActions()[startingCount + 1].payload.isSearching).toBe(false,
      'Received a SET_PAGE_DETAILS event with { isSearching: false } after Escape');
  });

  it('CmdOrCtrl+F/Escape fires SET_PAGE_DETAILS with isSearching', async function() {
    const { store } = window.app;
    const getSearchingActions = () =>
      store.history.filter(action =>
        action.type === actions.SET_PAGE_DETAILS && 'isSearching' in action.payload);
    const startingCount = getSearchingActions().length;

    fireKeyDown({ metaKey: true, code: 'KeyF' });

    await waitUntil(() => getSearchingActions().length === startingCount + 1);
    expect(getSearchingActions()[startingCount].payload.isSearching).toBe(true,
      'Received a SET_PAGE_DETAILS event with { isSearching: true } after CmdOrCtrl+F');

    fireKeyDown({ code: 'Escape' });

    await waitUntil(() => getSearchingActions().length === startingCount + 2);
    expect(getSearchingActions()[startingCount + 1].payload.isSearching).toBe(false,
      'Received a SET_PAGE_DETAILS event with { isSearching: false } after Escape');
  });

  it('CmdOrCtrl+F/Slash and Escape toggles search div visibility', async function() {
    fireKeyDown({ metaKey: true, code: 'KeyF' });

    await waitUntil(() => !$('#browser-page-search').hasAttribute('hidden'));
    expect($('#browser-page-search').hasAttribute('hidden')).toBe(false,
      'Search div is not hidden after CmdOrCtrl+F');

    fireKeyDown({ code: 'Escape' });

    await waitUntil(() => $('#browser-page-search').hasAttribute('hidden'));
    expect($('#browser-page-search').hasAttribute('hidden')).toBe(true,
      'Search div is hidden after Escape');

    fireKeyDown({ code: 'Slash' });

    await waitUntil(() => !$('#browser-page-search').hasAttribute('hidden'));
    expect($('#browser-page-search').hasAttribute('hidden')).toBe(false,
      'Search div is not hidden after "Slash"');

    fireKeyDown({ code: 'Escape' });

    await waitUntil(() => $('#browser-page-search').hasAttribute('hidden'));
    expect($('#browser-page-search').hasAttribute('hidden')).toBe(true,
      'Search div is hidden after Escape');
  });
});
