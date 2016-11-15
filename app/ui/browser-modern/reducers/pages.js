/*
Copyright 2016 Mozilla

Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed
under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
CONDITIONS OF ANY KIND, either express or implied. See the License for the
specific language governing permissions and limitations under the License.
*/

import Immutable from 'immutable';

import { logger } from '../../../shared/logging';
import Page from '../model/page';
import Pages from '../model/pages';
import PageState from '../model/page-state';
import SSLCertificateModel from '../model/ssl-certificate';
import PageLocalHistoryItem from '../model/page-local-history-item';
import RestorablePage from '../model/restorable-page';
import * as UIConstants from '../constants/ui';
import * as ActionTypes from '../constants/action-types';
import { createHistoryRestoreUrl } from '../../shared/util/url-util';

export default function(state = new Pages(), action) {
  switch (action.type) {
    case ActionTypes.CREATE_PAGE:
      return createPage(state, action.id, action.location, action.options);

    case ActionTypes.REMOVE_PAGE:
      return removePage(state, action.pageId);

    case ActionTypes.SET_SELECTED_PAGE:
      return setSelectedPage(state, action.pageId);

    case ActionTypes.RESET_PAGE_DATA:
      return resetPageData(state, action.pageId);

    case ActionTypes.SET_PAGE_INDEX:
      return setPageIndex(state, action.pageId, action.pageIndex);

    case ActionTypes.SET_PAGE_DETAILS:
      return setPageDetails(state, action.pageId, action.pageDetails);

    case ActionTypes.SET_PAGE_META:
      return setPageMeta(state, action.pageId, action.pageMeta);

    case ActionTypes.SET_PAGE_STATE:
      return setPageState(state, action.pageId, action.pageState);

    case ActionTypes.SET_PAGE_UI_STATE:
      return setPageUIState(state, action.pageId, action.pageUIState);

    case ActionTypes.SET_LOCAL_PAGE_HISTORY:
      return setLocalPageHistory(state, action.pageId, action.history, action.historyIndex);

    case ActionTypes.POP_RECENTLY_CLOSED_PAGE:
      return popRecentlyClosedPage(state);

    default:
      return state;
  }
}

function createPage(state, id, location = UIConstants.HOME_PAGE, options = {
  selected: true,
  index: null,
}) {
  return state.withMutations(mut => {
    const page = new Page({ id, location });
    const pageIndex = options.index != null ? options.index : state.displayOrder.size;

    mut.update('displayOrder', l => l.insert(pageIndex, page.id));
    mut.update('ids', s => s.add(page.id));
    mut.update('map', m => m.set(page.id, page));

    if (options.selected) {
      mut.set('selectedId', page.id);
    }
  });
}

function removePage(state, pageId) {
  return state.withMutations(mut => {
    const pageIndex = state.displayOrder.findIndex(id => id === pageId);
    if (pageIndex === -1) {
      throw new Error(`Removing page ${pageId} that's not present in displayOrder.`);
    }

    const pageCount = state.displayOrder.size;
    const selectedId = state.get('selectedId');

    // Add this page to `recentlyClosed` so we can restore it via
    // page index and history restore URL
    const historyURLs = state.map.get(pageId).history.toJS().map(h => h.url);
    const historyIndex = state.map.get(pageId).historyIndex;
    const restoreURL = createHistoryRestoreUrl(historyURLs, historyIndex);
    mut.update('recentlyClosed', l => l.push(new RestorablePage({
      restoreURL,
      pageIndex,
      id: pageId,
    })));
    while (mut.get('recentlyClosed').size > UIConstants.CLOSED_TAB_HISTORY_COUNT) {
      mut.update('recentlyClosed', l => l.shift());
    }

    // Remove page first.
    mut.update('displayOrder', l => l.delete(pageIndex));
    mut.update('ids', s => s.delete(pageId));
    mut.update('map', m => m.delete(pageId));

    // If the last page was removed, there's no other page remaining to select.
    // However, we won't allow states where there aren't any pages available,
    // the action creator will dispatch an action to add another page.
    if (pageCount === 1) {
      mut.set('selectedId', '');
      return;
    }

    // If we had at least two pages before removing, select the next one
    // if we are removing the currently selected page. If there isn't a next tab, select
    // the previous.
    let newSelectedId;
    if (pageId === selectedId) {
      if (pageIndex === pageCount - 1) {
        newSelectedId = state.displayOrder.get(pageIndex - 1);
      } else {
        newSelectedId = state.displayOrder.get(pageIndex + 1);
      }
      mut.set('selectedId', newSelectedId);
    }
  });
}

function setSelectedPage(state, pageId) {
  return state.set('selectedId', pageId);
}

function resetPageData(state, pageId) {
  return state.withMutations(mut => {
    const fresh = new Page({ id: pageId }).entries();
    for (const [key, value] of fresh) {
      // Don't reset the `uiState`, `history` and `historyIndex` properties
      // on the page.
      if (key !== 'uiState' && key !== 'history' && key !== 'historyIndex') {
        mut.update('map', m => m.setIn([pageId, key], value));
      }
    }
  });
}

function setPageIndex(state, pageId, pageIndex) {
  if (state.ids.size < pageIndex) {
    return state;
  }

  return state.withMutations(mut => {
    const oldIndex = state.displayOrder.findIndex(id => id === pageId);
    if (oldIndex === -1) {
      // No item found: the caller made a mistake.
      throw new Error(`Page ${pageId} not found in displayOrder. Not setting index to ${pageIndex}.`);
    }
    mut.update('displayOrder', l => l.delete(oldIndex));
    mut.update('displayOrder', l => l.insert(pageIndex, pageId));
  });
}

function setPageDetails(state, pageId, pageDetails) {
  return state.withMutations(mut => {
    for (const [key, value] of Object.entries(pageDetails)) {
      if (key === 'id') {
        logger.warn('Skipping setting of `id` on page.');
        continue;
      }
      if (typeof value === 'object' && !Immutable.Iterable.isIterable(value)) {
        logger.warn(`Setting a non-immutable object \`${key}\` on page.`);
      }
      mut.update('map', m => m.setIn([pageId, key], value));
    }
  });
}

function setPageMeta(state, pageId, pageMeta) {
  return state.withMutations(mut => {
    for (const [key, value] of Object.entries(pageMeta)) {
      mut.update('map', m => m.setIn([pageId, 'meta', key], value));
    }
  });
}

function setPageState(state, pageId, pageState) {
  return state.withMutations(mut => {
    for (const [key, value] of Object.entries(pageState)) {
      const prevValue = state.getIn(['map', pageId, 'state', key]);
      let nextValue = value;

      // Don't update the page load state to "LOADED" if it's not "LOADING".
      // We're dong this to avoid overwriting failed load states.
      if (key === 'load' &&
          value === PageState.STATES.LOADED &&
          prevValue !== PageState.STATES.LOADING) {
        logger.warn('Skipping setting a `LOADED` page state.');
        continue;
      }

      if (key === 'certificate') {
        nextValue = new SSLCertificateModel(value);
      }

      mut.update('map', m => m.setIn([pageId, 'state', key], nextValue));
    }
  });
}

function setPageUIState(state, pageId, pageUIState) {
  return state.withMutations(mut => {
    for (const [key, value] of Object.entries(pageUIState)) {
      mut.update('map', m => m.setIn([pageId, 'uiState', key], value));
    }
  });
}

function setLocalPageHistory(state, pageId, history, historyIndex) {
  return state.withMutations(mut => {
    const records = history.map((location, index) => new PageLocalHistoryItem({
      url: location,
      active: index === historyIndex,
    }));
    mut.setIn(['map', pageId, 'history'], Immutable.List(records));
    mut.setIn(['map', pageId, 'historyIndex'], historyIndex);
  });
}

function popRecentlyClosedPage(state) {
  return state.set('recentlyClosed', state.get('recentlyClosed').pop());
}
