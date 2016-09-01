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

import { logger } from '../../../shared/logging';
import Page from '../model/page';
import Pages from '../model/pages';
import * as UIConstants from '../constants/ui';
import * as ActionTypes from '../constants/action-types';

export default function(state = new Pages(), action) {
  switch (action.type) {
    case ActionTypes.CREATE_PAGE:
      return createPage(state, action.location, action.options);

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

    case ActionTypes.SET_PAGE_DETAILS:
      return setPageDetails(state, action.pageId, action.details);

    default:
      return state;
  }
}

function createPage(state, location = UIConstants.HOME_PAGE, options = { selected: true }) {
  return state.withMutations(mut => {
    const page = new Page({ location });
    mut.update('list', l => l.push(page));

    if (options.selected) {
      mut.set('selectedId', page.id);
    }
  });
}

function removePage(state, pageId) {
  return state.withMutations(mut => {
    const pageCount = state.list.size;
    const pageIndex = state.list.findIndex(page => page.id === pageId);

    // We never allow removing the last page.
    if (pageCount === 1) {
      const page = new Page({ location: UIConstants.HOME_PAGE });
      mut.update('list', l => l.delete(pageIndex));
      mut.update('list', l => l.push(page));
      mut.set('selectedId', page.id);
      return;
    }

    // If we had at least two pages before removing, select the previous one
    // this isn't the first page, otherwise the next one.
    if (pageIndex === 0) {
      mut.set('selectedId', state.list.get(1).id);
    } else {
      mut.set('selectedId', state.list.get(pageIndex - 1).id);
    }
    mut.update('list', l => l.delete(pageIndex));
  });
}

function setSelectedPage(state, pageId) {
  return state.set('selectedId', pageId);
}

function setSelectedPageIndex(state, pageIndex) {
  const selectedPage = state.list.get(pageIndex);
  if (selectedPage) {
    return state.set('selectedId', selectedPage.id);
  }
  return state;
}

function setSelectedPagePrevious(state) {
  const selectedId = state.selectedId;
  const selectedIndex = state.list.findIndex(page => page.id === selectedId);

  // Immutable handles looping for us via negative indexes.
  const prevIndex = selectedIndex - 1;
  return setSelectedPageIndex(state, prevIndex);
}

function setSelectedPageNext(state) {
  const selectedId = state.selectedId;
  const selectedIndex = state.list.findIndex(page => page.id === selectedId);

  // Manually handle looping when going out of bounds rightward.
  const pageCount = state.list.size;
  const nextIndex = selectedIndex === pageCount - 1 ? 0 : selectedIndex + 1;
  return setSelectedPageIndex(state, nextIndex);
}

function setPageDetails(state, pageId, details) {
  return state.withMutations(mut => {
    const pageIndex = state.list.findIndex(page => page.id === pageId);

    for (const [key, value] of Object.entries(details)) {
      if (key === 'id') {
        logger.warn('Skipping setting of `id` on page.');
        continue;
      }
      mut.setIn(['list', pageIndex, key], value);
    }
  });
}
