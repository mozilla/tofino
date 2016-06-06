// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/
/* eslint prefer-arrow-callback: 0 */
/* eslint no-undef: 0 */

import expect from 'expect';
import { ipcRenderer } from 'electron';
import { waitUntil } from '../utils/async';
import * as actions from '../../app/ui/browser/constants/action-types';

describe('renderer - ipc messages', function() {
  it('[new-tab] fires CREATE_TAB', async function() {
    const { store } = window.app;
    const getCreateTabEvents = () =>
      store.history.filter(action => action.type === actions.CREATE_TAB).length;
    const startingEvents = getCreateTabEvents();

    ipcRenderer.emit('new-tab');

    await waitUntil(() => {
      const eventCount = getCreateTabEvents();
      return eventCount === startingEvents + 1;
    });
    const eventCount = getCreateTabEvents();
    expect(eventCount).toBe(startingEvents + 1, 'Received another CREATE_TAB event');
  });
});
