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
import PageMeta from '../model/page-meta';
import PageState from '../model/page-state';
import * as UIConstants from '../constants/ui';
import * as ActionTypes from '../constants/action-types';

export default function(state = new Pages(), action) {
  switch (action.type) {
    case ActionTypes.CREATE_PAGE:
      return createPage(state, action.id, action.location, action.options);

    case ActionTypes.REMOVE_PAGE:
      return removePage(state, action.pageId);

    case ActionTypes.SET_SELECTED_PAGE:
      return setSelectedPage(state, action.pageId);

    case ActionTypes.SET_SELECTED_PAGE_INDEX:
      return setSelectedPageIndex(state, action.pageIndex);

    case ActionTypes.SET_SELECTED_PAGE_PREVIOUS:
      return setSelectedPagePrevious(state);

    case ActionTypes.SET_SELECTED_PAGE_NEXT:
      return setSelectedPageNext(state);

    case ActionTypes.RESET_PAGE_DATA:
      return resetPageData(state, action.pageId);

    case ActionTypes.SET_PAGE_DETAILS:
      return setPageDetails(state, action.pageId, action.pageDetails);

    case ActionTypes.SET_PAGE_META:
      return setPageMeta(state, action.pageId, action.pageMeta);

    case ActionTypes.SET_PAGE_STATE:
      return setPageState(state, action.pageId, action.pageState);

    default:
      return state;
  }
}

function createPage(state, id, location = UIConstants.HOME_PAGE, options = { selected: true }) {
  return state.withMutations(mut => {
    const page = new Page({ id, location });
    mut.update('orderedIds', l => l.push(page.id));
    mut.update('map', m => m.set(page.id, page));

    if (options.selected) {
      mut.set('selectedId', page.id);
    }
  });
}

function removePage(state, pageId) {
  return state.withMutations(mut => {
    const pageCount = state.orderedIds.size;
    const pageIndex = state.orderedIds.findIndex(id => id === pageId);

    // Remove page first.
    mut.update('orderedIds', l => l.delete(pageIndex));
    mut.update('map', m => m.delete(pageId));

    // If the last page was removed, there's no other page remaining to select.
    // However, we won't allow states where there aren't any pages available,
    // the action creator will dispatch an action to add another page.
    if (pageCount === 1) {
      mut.set('selectedId', '');
      return;
    }

    // If we had at least two pages before removing, select the previous one
    // this isn't the first page, otherwise the next one.
    if (pageIndex === 0) {
      mut.set('selectedId', state.orderedIds.get(1));
    } else {
      mut.set('selectedId', state.orderedIds.get(pageIndex - 1));
    }
  });
}

function setSelectedPage(state, pageId) {
  return state.set('selectedId', pageId);
}

function setSelectedPageIndex(state, pageIndex) {
  const selectedPageId = state.orderedIds.get(pageIndex);
  if (selectedPageId) {
    return state.set('selectedId', selectedPageId);
  }
  return state;
}

function setSelectedPagePrevious(state) {
  const selectedId = state.selectedId;
  const selectedIndex = state.orderedIds.findIndex(id => id === selectedId);

  // Immutable handles looping for us via negative indexes.
  const prevIndex = selectedIndex - 1;
  return setSelectedPageIndex(state, prevIndex);
}

function setSelectedPageNext(state) {
  const selectedId = state.selectedId;
  const selectedIndex = state.orderedIds.findIndex(id => id === selectedId);

  // Manually handle looping when going out of bounds rightward.
  const pageCount = state.orderedIds.size;
  const nextIndex = selectedIndex === pageCount - 1 ? 0 : selectedIndex + 1;
  return setSelectedPageIndex(state, nextIndex);
}

function resetPageData(state, pageId) {
  return setPageDetails(state, pageId, {
    location: '',
    title: '',
    canGoBack: false,
    canGoForward: false,
    canRefresh: false,
    meta: new PageMeta(),
    state: new PageState(),
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
  return setPageDetails(state, pageId, { meta: new PageMeta(pageMeta) });
}

function setPageState(state, pageId, pageState) {
  return state.withMutations(mut => {
    for (const [key, value] of Object.entries(pageState)) {
      mut.update('map', m => m.setIn([pageId, 'state', key], value));
    }
  });
}
