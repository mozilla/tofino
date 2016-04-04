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

/**
 * The top level definition of what a browser looks like.
 * (At least a new-born browser that can do little more than cry)
 */
export const State = Immutable.Record({
  // This is a list of Page objects (see below)
  pages: Immutable.List(),
  // This should be the order in which tabs are displayed.
  pageOrder: Immutable.List(),
  // The currently displayed tab
  currentPageIndex: -1,
});

/**
 * The data that we store alongside a single web page
 */
export const Page = Immutable.Record({
  location: undefined,
  title: 'New Tab',
  statusText: false,
  userTyped: null,
  isLoading: false,
  isSearching: false,
  canGoBack: false,
  canGoForward: false,
  canRefresh: false,
  isBookmarked: false,
});
