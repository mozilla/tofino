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

import { ipcRenderer } from '../../shared/electron';

import * as ContentURLs from '../../shared/constants/content-pages-locations';
import * as ExternalEffects from './actions/external-effects';
import * as RootActions from './actions/root-actions';
import * as PageActions from './actions/page-actions';
import * as PageEffects from './actions/page-effects';
import * as PagesSelectors from './selectors/pages';
import * as UISelectors from './selectors/ui';
import * as UIEffects from './actions/ui-effects';
import * as Gestures from '../shared/util/gestures';

export default function({ store, userAgentClient }) {
  // Attach listeners to the window to emit events on IPC during
  // some UI events (like swiping)
  Gestures.attachGestureListeners();

  // Set max listeners to Infinity, because each new page will listen to more
  // events, and we'll intentionally go beyond the 10 listener default.
  ipcRenderer.setMaxListeners(Infinity);

  // Wait until the main process negotiates an address for the UA service, and
  // then subsequently connect.
  ipcRenderer.on('user-agent-service-info', (_, { port, version, host }) => {
    userAgentClient.connect({ port, version, host });
  });

  // Add other various main process event listeners.
  ipcRenderer.on('window-id', (_, windowId) => {
    store.dispatch(RootActions.setWindowId(windowId));
  });

  ipcRenderer.on('reload-window', () => {
    store.dispatch(ExternalEffects.reloadWindow());
  });

  ipcRenderer.on('close-window', () => {
    store.dispatch(ExternalEffects.closeWindow());
  });

  ipcRenderer.on('new-tab', (_, location) => {
    store.dispatch(PageEffects.createPageSession(location));
  });

  ipcRenderer.on('close-tab', () => {
    const pageId = PagesSelectors.getSelectedPageId(store.getState());
    const pageIsPinned = PagesSelectors.getPagePinned(store.getState(), pageId);
    if (!pageIsPinned && !UISelectors.getOverviewVisible(store.getState())) {
      store.dispatch(PageEffects.destroyCurrentPageSession());
    }
  });

  ipcRenderer.on('go-back', () => {
    const pageId = PagesSelectors.getSelectedPageId(store.getState());
    const pageCanGoBack = PagesSelectors.getPageCanGoBack(store.getState(), pageId);
    if (pageCanGoBack && !UISelectors.getOverviewVisible(store.getState())) {
      store.dispatch(PageEffects.navigateCurrentPageBack());
    }
  });

  ipcRenderer.on('go-forward', () => {
    const pageId = PagesSelectors.getSelectedPageId(store.getState());
    const pageCanGoForward = PagesSelectors.getPageCanGoForward(store.getState(), pageId);
    if (pageCanGoForward && !UISelectors.getOverviewVisible(store.getState())) {
      store.dispatch(PageEffects.navigateCurrentPageForward());
    }
  });

  ipcRenderer.on('page-refresh', (_, options = {}) => {
    const pageId = PagesSelectors.getSelectedPageId(store.getState());
    const pageCanRefresh = PagesSelectors.getPageCanRefresh(store.getState(), pageId);
    if (pageCanRefresh && !UISelectors.getOverviewVisible(store.getState())) {
      store.dispatch(PageEffects.navigateCurrentPageRefresh(options));
    }
  });

  ipcRenderer.on('toggle-devtools', () => {
    if (!UISelectors.getOverviewVisible(store.getState())) {
      store.dispatch(PageEffects.toggleCurrentPageDevtools());
    }
  });

  ipcRenderer.on('select-tab-previous', () => {
    store.dispatch(PageActions.setSelectedPagePrevious());
  });

  ipcRenderer.on('select-tab-next', () => {
    store.dispatch(PageActions.setSelectedPageNext());
  });

  ipcRenderer.on('select-tab-last', () => {
    const index = PagesSelectors.getPageCount(store.getState()) - 1;
    store.dispatch(PageActions.setSelectedPageIndex(index));
  });

  ipcRenderer.on('select-tab-index', (_, index) => {
    if (PagesSelectors.hasPageAtIndex(store.getState(), index)) {
      store.dispatch(PageActions.setSelectedPageIndex(index));
    }
  });

  ipcRenderer.on('focus-url-bar', () => {
    store.dispatch(UIEffects.focusCurrentURLBar({ select: true }));
  });

  ipcRenderer.on('show-page-search', () => {
    if (!UISelectors.getOverviewVisible(store.getState())) {
      store.dispatch(PageActions.showCurrentPageSearch());
    }
  });

  ipcRenderer.on('hide-page-search', () => {
    if (!UISelectors.getOverviewVisible(store.getState())) {
      store.dispatch(PageActions.hideCurrentPageSearch());
    }
  });

  ipcRenderer.on('zoom-in', () => {
    store.dispatch(PageEffects.performCurrentPageZoomIn());
  });

  ipcRenderer.on('zoom-out', () => {
    store.dispatch(PageEffects.performCurrentPageZoomOut());
  });

  ipcRenderer.on('zoom-reset', () => {
    store.dispatch(PageEffects.performCurrentPageZoomReset());
  });

  ipcRenderer.on('zoom-in', () => {
    store.dispatch(PageEffects.performCurrentPageZoomIn());
  });

  ipcRenderer.on('zoom-out', () => {
    store.dispatch(PageEffects.performCurrentPageZoomOut());
  });

  ipcRenderer.on('zoom-reset', () => {
    store.dispatch(PageEffects.performCurrentPageZoomReset());
  });

  ipcRenderer.on('show-stars', () => {
    store.dispatch(PageEffects.createPageSession(ContentURLs.STARS_PAGE));
  });

  ipcRenderer.on('show-history', () => {
    store.dispatch(PageEffects.createPageSession(ContentURLs.HISTORY_PAGE));
  });

  ipcRenderer.on('show-credits', () => {
    store.dispatch(PageEffects.createPageSession(ContentURLs.CREDITS_PAGE));
  });

  ipcRenderer.on('capture-page', () => {
    store.dispatch(PageEffects.captureCurrentPage());
  });

  ipcRenderer.on('download-completed', (_, { url, filename, path }) => {
    store.dispatch(UIEffects.showDownloadNotification({ url, path, filename, status: 'success' }));
  });

  ipcRenderer.on('download-error', (_, { url, filename, path }) => {
    store.dispatch(UIEffects.showDownloadNotification({ url, path, filename, status: 'error' }));
  });

  // Fired on the first browser window when default browser is not Tofino.
  ipcRenderer.on('should-set-default-browser', () => {
    store.dispatch(UIEffects.confirmDefaultBrowser());
  });
}
