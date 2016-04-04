
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
