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

import { call, apply, select, put } from 'redux-saga/effects';

import { logger } from '../../../shared/logging';
import { ipcRenderer, remote } from '../../../shared/electron';
import { infallible, takeLatestMultiple, takeEveryMultiple } from '../../shared/util/saga-util';
import PageState from '../model/page-state';
import PageContextMenu from '../views/menus/page-context-menu';
import userAgentHttpClient from '../../../shared/user-agent-http-client';
import * as Certificate from '../../shared/util/cert';
import * as ContentScriptUtils from '../../shared/util/content-script-utils';
import * as PageActions from '../actions/page-actions';
import * as PageEffects from '../actions/page-effects';
import * as ProfileEffects from '../actions/profile-effects';
import * as UIEffects from '../actions/ui-effects';
import * as EffectTypes from '../constants/effect-types';
import * as PageSelectors from '../selectors/pages';

export default function*() {
  yield takeEveryMultiple(
    [EffectTypes.CREATE_PAGE_SESSION, infallible(createPageSession, logger)],
    [EffectTypes.DESTROY_PAGE_SESSION, infallible(destroyPageSession, logger)],
    [EffectTypes.BULK_CREATE_STANDALONE_PAGE_SESSIONS,
      infallible(bulkCreateStandalonePageSessions, logger)],
    [EffectTypes.BULK_DESTROY_STANDALONE_PAGE_SESSIONS,
      infallible(bulkDestroyStandalonePageSessions, logger)],
    [EffectTypes.GET_CERTIFICATE_ERROR, infallible(getCertificateError, logger)],
  );
  yield takeLatestMultiple(
    [EffectTypes.NAVIGATE_PAGE_TO, infallible(naviatePageTo, logger)],
    [EffectTypes.NAVIGATE_PAGE_BACK, infallible(navigatePageBack, logger)],
    [EffectTypes.NAVIGATE_PAGE_FORWARD, infallible(navigatePageForward, logger)],
    [EffectTypes.NAVIGATE_PAGE_REFRESH, infallible(navigatePageRefresh, logger)],
    [EffectTypes.NAVIGATE_PAGE_IN_HISTORY, infallible(navigatePageInHistory, logger)],
    [EffectTypes.TOGGLE_DEVTOOLS, infallible(toggleDevtools, logger)],
    [EffectTypes.PERFORM_DEVTOOLS_INSPECT_ELEMENT, infallible(performInspectElement, logger)],
    [EffectTypes.PERFORM_PAGE_DOWNLOAD, infallible(performPageDownload, logger)],
    [EffectTypes.PERFORM_PAGE_SEARCH, infallible(performPageSearch, logger)],
    [EffectTypes.SET_PAGE_ZOOM_LEVEL, infallible(setPageZoomLevel, logger)],
    [EffectTypes.CAPTURE_PAGE, infallible(capturePage, logger)],
    [EffectTypes.PARSE_PAGE_META_DATA, infallible(parsePageMetaData, logger)],
    [EffectTypes.DISPLAY_WEBVIEW_CONTEXT_MENU, infallible(displayWebviewContextMenu, logger)],
    [EffectTypes.PIN_TAB, infallible(pinTab, logger)],
    [EffectTypes.UNPIN_TAB, infallible(unpinTab, logger)],
  );
}

export function* createPageSession({ id, location, options, withUI }) {
  yield apply(userAgentHttpClient, userAgentHttpClient.createSession, [id, {}]);

  if (withUI) {
    yield put(PageActions.createPage(id, location, options));
  }
}

export function* destroyPageSession({ id, withUI }) {
  const page = yield select(PageSelectors.getPageById, id);
  yield apply(userAgentHttpClient, userAgentHttpClient.destroySession, [page, {}]);

  if (withUI) {
    const currentPageCount = yield select(PageSelectors.getPageCount);
    yield put(PageActions.removePage(page.id));

    // If the last page was removed, dispatch an action to create another one.
    if (currentPageCount === 1) {
      yield put(PageEffects.createPageSession());
    }
  }
}

export function* bulkCreateStandalonePageSessions({ ids, channel }) {
  for (const id of ids) {
    yield apply(userAgentHttpClient, userAgentHttpClient.createSession, [id, {}]);
  }
  if (channel) {
    yield put(channel, 'DONE');
  }
}

export function* bulkDestroyStandalonePageSessions({ ids, channel }) {
  for (const id of ids) {
    const page = yield select(PageSelectors.getPageById, id);
    yield apply(userAgentHttpClient, userAgentHttpClient.destroySession, [page, {}]);
  }
  if (channel) {
    yield put(channel, 'DONE');
  }
}

export function* naviatePageTo({ pageId, webview, location }) {
  yield put(PageActions.resetPageData(pageId));
  yield put(PageActions.setPageState(pageId, {
    load: PageState.STATES.CONNECTING,
    navigationType: PageState.NAVIGATION_TYPES.NAVIGATED_TO_LOCATION,
  }));
  // Optimistically set page location and update the urlbar before the actual
  // navigation happens, so that the UI shows the intended location instead of
  // just some blank text.
  yield put(PageActions.setPageDetails(pageId, { location }));
  yield put(UIEffects.setURLBarValue(pageId, location));
  yield apply(webview, webview.setAttribute, ['src', location]);
}

export function* navigatePageBack({ pageId, webview }) {
  yield put(PageActions.resetPageData(pageId));
  yield put(PageActions.setPageState(pageId, {
    load: PageState.STATES.CONNECTING,
    navigationType: PageState.NAVIGATION_TYPES.NAVIGATED_BACK,
  }));
  yield apply(webview, webview.goBack);
}

export function* navigatePageForward({ pageId, webview }) {
  yield put(PageActions.resetPageData(pageId));
  yield put(PageActions.setPageState(pageId, {
    load: PageState.STATES.CONNECTING,
    navigationType: PageState.NAVIGATION_TYPES.NAVIGATED_FORWARD,
  }));
  yield apply(webview, webview.goForward);
}

export function* navigatePageRefresh({ pageId, webview, ignoreCache }) {
  yield put(PageActions.resetPageData(pageId));
  yield put(PageActions.setPageState(pageId, {
    load: PageState.STATES.CONNECTING,
    navigationType: PageState.NAVIGATION_TYPES.REFRESHED,
  }));
  if (ignoreCache) {
    yield apply(webview, webview.reloadIgnoringCache);
  } else {
    yield apply(webview, webview.reload);
  }
}

export function* navigatePageInHistory({ pageId, webview, historyIndex }) {
  yield put(PageActions.resetPageData(pageId));
  yield put(PageActions.setPageState(pageId, {
    load: PageState.STATES.CONNECTING,
    navigationType: PageState.NAVIGATION_TYPES.NAVIGATED_IN_HISTORY,
  }));
  yield apply(webview, webview.goToIndex, [historyIndex]);
}

export function* toggleDevtools({ webview }) {
  if (!(yield apply(webview, webview.isDevToolsOpened))) {
    yield apply(webview, webview.openDevTools);
  } else {
    yield apply(webview, webview.closeDevTools);
  }
}

export function* performInspectElement({ webview, x, y }) {
  yield apply(webview, webview.inspectElement, [x, y]);
}

export function* performPageDownload({ webview, url }) {
  yield apply(webview, webview.downloadURL, [url]);
}

export function* performPageSearch({ webview, text, options }) {
  try {
    if (!text) {
      yield apply(webview, webview.stopFindInPage, ['clearSelection']);
    } else {
      yield apply(webview, webview.findInPage, [text, options]);
    }
  } catch (e) {
    logger.warn(e);
  }
}

export function* setPageZoomLevel({ pageId, webview, zoomLevel }) {
  yield apply(webview, webview.setZoomLevel, [zoomLevel]);
  yield put(PageActions.setPageUIState(pageId, { zoomLevel }));
}

export function* capturePage({ pageId, webview }) {
  const script = 'window._readerify(window.document)';
  const readerResult = yield call(ContentScriptUtils.executeJS, webview, script);
  yield put(ProfileEffects.addCapturedPage(pageId, readerResult));
}

export function* parsePageMetaData({ pageId, webview }) {
  const script = 'window._parseMetadata(window.document)';
  const metadataResult = yield call(ContentScriptUtils.executeJS, webview, script);
  yield put(PageActions.setPageMeta(pageId, metadataResult));
}

export function* getCertificateError({ pageId, url }) {
  const { error, certificate } = yield call(Certificate.getCertificateError, url);
  yield put(PageActions.setPageState(pageId, { error, certificate }));
}

export function* displayWebviewContextMenu({ e, pageId }) {
  const menu = new PageContextMenu(pageId, {
    event: e,
    canPageGoBack: yield select(PageSelectors.getPageCanGoBack, pageId),
    canPageGoForward: yield select(PageSelectors.getPageCanGoForward, pageId),
    canPageRefresh: yield select(PageSelectors.getPageCanRefresh, pageId),
  });

  const win = yield apply(remote, remote.getCurrentWindow);
  const action = yield apply(menu, menu.popup, [win]);
  yield put(action);
}

export function* pinTab({ pageId, webContentsId }) {
  yield put(PageActions.setPagePinned(pageId));
  yield apply(ipcRenderer, ipcRenderer.send, ['guest-pinned-state', webContentsId, true]);
}

export function* unpinTab({ pageId, webContentsId }) {
  yield put(PageActions.setPageUnpinned(pageId));
  yield apply(ipcRenderer, ipcRenderer.send, ['guest-pinned-state', webContentsId, false]);
}
