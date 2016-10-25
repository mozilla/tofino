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

import { ipcRenderer, remote } from '../../../shared/electron';
import { takeLatestMultiple, takeEveryMultiple } from '../../shared/util/saga-util';
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
    [EffectTypes.CREATE_PAGE_SESSION, createPageSession],
    [EffectTypes.DESTROY_PAGE_SESSION, destroyPageSession],
    [EffectTypes.BULK_CREATE_STANDALONE_PAGE_SESSIONS, bulkCreateStandalonePageSessions],
    [EffectTypes.BULK_DESTROY_STANDALONE_PAGE_SESSIONS, bulkDestroyStandalonePageSessions],
    [EffectTypes.GET_CERTIFICATE_ERROR, getCertificateError],
  );
  yield takeLatestMultiple(
    [EffectTypes.NAVIGATE_PAGE_TO, naviatePageTo],
    [EffectTypes.NAVIGATE_PAGE_BACK, navigatePageBack],
    [EffectTypes.NAVIGATE_PAGE_FORWARD, navigatePageForward],
    [EffectTypes.NAVIGATE_PAGE_REFRESH, navigatePageRefresh],
    [EffectTypes.NAVIGATE_PAGE_IN_HISTORY, navigatePageInHistory],
    [EffectTypes.TOGGLE_DEVTOOLS, toggleDevtools],
    [EffectTypes.PERFORM_DEVTOOLS_INSPECT_ELEMENT, performDevtoolsInspectElement],
    [EffectTypes.PERFORM_PAGE_DOWNLOAD, performPageDownload],
    [EffectTypes.PERFORM_PAGE_SEARCH, performPageSearch],
    [EffectTypes.SET_PAGE_ZOOM_LEVEL, setPageZoomLevel],
    [EffectTypes.CAPTURE_PAGE, capturePage],
    [EffectTypes.PARSE_PAGE_META_DATA, parsePageMetaData],
    [EffectTypes.DISPLAY_WEBVIEW_CONTEXT_MENU, displayWebviewContextMenu],
    [EffectTypes.PIN_TAB, pinTab],
    [EffectTypes.UNPIN_TAB, unpinTab],
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

export function* performDevtoolsInspectElement({ webview, x, y }) {
  yield apply(webview, webview.inspectElement, [x, y]);
}

export function* performPageDownload({ webview, url }) {
  yield apply(webview, webview.downloadURL, [url]);
}

export function* performPageSearch({ webview, text }) {
  if (!text) {
    yield apply(webview, webview.stopFindInPage, ['clearSelection']);
  } else {
    yield apply(webview, webview.findInPage, [text]);
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
