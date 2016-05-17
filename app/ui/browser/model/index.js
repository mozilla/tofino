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
import uuid from 'uuid';

/**
 * The data directly related to pages and tabs.
 */
export const Pages = Immutable.Record({
  // This is a list of Page objects (see below)
  pages: Immutable.List(),

  // The currently displayed tab
  currentPageIndex: -1,
}, 'Pages');

/**
 * The data that we store alongside a single web page
 */
export class Page extends Immutable.Record({
  id: null,
  sessionId: undefined, // ?number.
  ancestorId: undefined, // ?number.
  location: undefined,
  title: 'New Tab',
  state: false,
  isSearching: false,
  canGoBack: false,
  canGoForward: false,
  canRefresh: false,
  chromeMode: 'expanded',
}, 'Page') {
  constructor(data) {
    super(Object.assign({ id: uuid.v4() }, data));
  }
}

Page.PAGE_STATE_LOADING = 'loading';
Page.PAGE_STATE_LOADED = 'loaded';
Page.PAGE_STATE_FAILED = 'failed';

/**
 * The browser window's view of its profile.
 */
export const Profile = Immutable.Record({
  bookmarks: Immutable.Set(),
  completions: Immutable.Map(),
}, 'Profile');

/**
 * Frequently changing UI state.
 */
export const UIState = Immutable.Record({
  // The url of the currently hovered-over link
  statusText: false,

  // What the user has typed into the location bar, stored by page id
  userTypedLocation: Immutable.Map(),

  // Should the autocomplete popup be visible
  showCompletions: true,
}, 'UIState');

/**
 * Aggregate state.  Keep this synchronized with ../reducers/index.js!
 */
export const State = Immutable.Record({
  pages: new Pages(),
  profile: new Profile(),
  uiState: new UIState(),
}, 'State');
