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

import { takeLatest, takeEvery } from 'redux-saga';
import { call, apply, select, put } from 'redux-saga/effects';

import Deferred from '../../../shared/deferred';
import { ipcRenderer, remote, clipboard } from '../../../shared/electron';
import { wrapped } from './helpers';
import * as Certificate from '../../shared/util/cert';
import * as ContentScriptUtils from '../../shared/util/content-script-utils';
import PageState from '../model/page-state';
import userAgentHttpClient from '../../../shared/user-agent-http-client';
import * as PageActions from '../actions/page-actions';
import * as PageEffects from '../actions/page-effects';
import * as ProfileEffects from '../actions/profile-effects';
import * as UIEffects from '../actions/ui-effects';
import * as EffectTypes from '../constants/effect-types';
import * as PageSelectors from '../selectors/pages';

const { Menu, MenuItem } = remote;

export default function*() {
  yield [
    takeEvery(...wrapped(EffectTypes.CREATE_PAGE_SESSION, createPageSession)),
    takeEvery(...wrapped(EffectTypes.DESTROY_PAGE_SESSION, destroyPageSession)),
    takeEvery(...wrapped(EffectTypes.BULK_CREATE_STANDALONE_PAGE_SESSIONS,
      bulkCreateStandalonePageSessions)),
    takeEvery(...wrapped(EffectTypes.BULK_DESTROY_STANDALONE_PAGE_SESSIONS,
      bulkDestroyStandalonePageSessions)),
    takeLatest(...wrapped(EffectTypes.NAVIGATE_PAGE_TO, naviatePageTo)),
    takeLatest(...wrapped(EffectTypes.NAVIGATE_PAGE_BACK, navigatePageBack)),
    takeLatest(...wrapped(EffectTypes.NAVIGATE_PAGE_FORWARD, navigatePageForward)),
    takeLatest(...wrapped(EffectTypes.NAVIGATE_PAGE_REFRESH, navigatePageRefresh)),
    takeLatest(...wrapped(EffectTypes.NAVIGATE_PAGE_IN_HISTORY, navigatePageInHistory)),
    takeLatest(...wrapped(EffectTypes.TOGGLE_DEVTOOLS, toggleDevtools)),
    takeLatest(...wrapped(EffectTypes.PERFORM_PAGE_SEARCH, performPageSearch)),
    takeLatest(...wrapped(EffectTypes.SET_PAGE_ZOOM_LEVEL, setPageZoomLevel)),
    takeLatest(...wrapped(EffectTypes.CAPTURE_PAGE, capturePage)),
    takeLatest(...wrapped(EffectTypes.PARSE_PAGE_META_DATA, parsePageMetaData)),
    takeEvery(...wrapped(EffectTypes.GET_CERTIFICATE_ERROR, getCertificateError)),
    takeLatest(...wrapped(EffectTypes.DISPLAY_WEBVIEW_CONTEXT_MENU, displayWebviewContextMenu)),
    takeLatest(...wrapped(EffectTypes.PIN_TAB, pinTab)),
    takeLatest(...wrapped(EffectTypes.UNPIN_TAB, unpinTab)),
  ];
}

function* createPageSession({ id, location, options, withUI }) {
  yield apply(userAgentHttpClient, userAgentHttpClient.createSession, [id, {}]);

  if (withUI) {
    yield put(PageActions.createPage(id, location, options));
  }
}

function* destroyPageSession({ id, withUI }) {
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

function* bulkCreateStandalonePageSessions({ ids, channel }) {
  for (const id of ids) {
    yield apply(userAgentHttpClient, userAgentHttpClient.createSession, [id, {}]);
  }
  if (channel) {
    yield put(channel, 'DONE');
  }
}

function* bulkDestroyStandalonePageSessions({ ids, channel }) {
  for (const id of ids) {
    const page = yield select(PageSelectors.getPageById, id);
    yield apply(userAgentHttpClient, userAgentHttpClient.destroySession, [page, {}]);
  }
  if (channel) {
    yield put(channel, 'DONE');
  }
}

function* naviatePageTo({ pageId, webview, location }) {
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
  webview.setAttribute('src', location);
}

function* navigatePageBack({ pageId, webview }) {
  yield put(PageActions.resetPageData(pageId));
  yield put(PageActions.setPageState(pageId, {
    load: PageState.STATES.CONNECTING,
    navigationType: PageState.NAVIGATION_TYPES.NAVIGATED_BACK,
  }));
  webview.goBack();
}

function* navigatePageForward({ pageId, webview }) {
  yield put(PageActions.resetPageData(pageId));
  yield put(PageActions.setPageState(pageId, {
    load: PageState.STATES.CONNECTING,
    navigationType: PageState.NAVIGATION_TYPES.NAVIGATED_FORWARD,
  }));
  webview.goForward();
}

function* navigatePageRefresh({ pageId, webview, ignoreCache }) {
  yield put(PageActions.resetPageData(pageId));
  yield put(PageActions.setPageState(pageId, {
    load: PageState.STATES.CONNECTING,
    navigationType: PageState.NAVIGATION_TYPES.REFRESHED,
  }));

  if (ignoreCache) {
    webview.reloadIgnoringCache();
  } else {
    webview.reload();
  }
}

function* navigatePageInHistory({ pageId, webview, historyIndex }) {
  yield put(PageActions.resetPageData(pageId));
  yield put(PageActions.setPageState(pageId, {
    load: PageState.STATES.CONNECTING,
    navigationType: PageState.NAVIGATION_TYPES.NAVIGATED_IN_HISTORY,
  }));
  webview.goToIndex(historyIndex);
}

function* toggleDevtools({ webview }) {
  if (!webview.isDevToolsOpened()) {
    webview.openDevTools();
  } else {
    webview.closeDevTools();
  }
}

function* performPageSearch({ webview, text }) {
  if (!text) {
    webview.stopFindInPage('clearSelection');
  } else {
    webview.findInPage(text);
  }
}

function* setPageZoomLevel({ pageId, webview, zoomLevel }) {
  webview.setZoomLevel(zoomLevel);
  yield put(PageActions.setPageUIState(pageId, { zoomLevel }));
}

function* capturePage({ pageId, webview }) {
  const script = 'window._readerify(window.document)';
  const readerResult = yield call(ContentScriptUtils.executeJS, webview, script);
  yield put(ProfileEffects.addCapturedPage(pageId, readerResult));
}

function* parsePageMetaData({ pageId, webview }) {
  const script = 'window._parseMetadata(window.document)';
  const metadataResult = yield call(ContentScriptUtils.executeJS, webview, script);
  yield put(PageActions.setPageMeta(pageId, metadataResult));
}

function* getCertificateError({ pageId, url }) {
  const { error, certificate } = yield call(Certificate.getCertificateError, url);
  yield put(PageActions.setPageState(pageId, { error, certificate }));
}

function* displayWebviewContextMenu({ e, pageId, webview }) {
  const menu = new Menu();
  const chosen = new Deferred();

  const canPageGoBack = yield select(PageSelectors.getPageCanGoBack, pageId);
  const canPageGoForward = yield select(PageSelectors.getPageCanGoForward, pageId);
  const canPageRefresh = yield select(PageSelectors.getPageCanRefresh, pageId);

  menu.append(new MenuItem({
    label: 'Back',
    click: () => chosen.resolve(function* () {
      yield put(PageEffects.navigatePageBack(pageId));
    }),
    enabled: canPageGoBack,
  }));

  menu.append(new MenuItem({
    label: 'Forward',
    click: () => chosen.resolve(function* () {
      yield put(PageEffects.navigatePageForward(pageId));
    }),
    enabled: canPageGoForward,
  }));

  menu.append(new MenuItem({
    label: 'Reload',
    click: () => chosen.resolve(function* () {
      yield put(PageEffects.navigatePageRefresh(pageId));
    }),
    enabled: canPageRefresh,
  }));

  menu.append(new MenuItem({ type: 'separator' }));

  if (e.href) {
    menu.append(new MenuItem({
      label: 'Open Link in New Tab',
      click: () => chosen.resolve(function* () {
        yield put(PageEffects.createPageSession(e.href));
      }),
    }));

    menu.append(new MenuItem({
      label: 'Copy Link Address',
      click: () => chosen.resolve(() => clipboard.writeText(e.href)),
    }));
  }

  if (e.img) {
    menu.append(new MenuItem({
      label: 'Copy Image URL',
      click: () => chosen.resolve(() => clipboard.writeText(e.img)),
    }));

    menu.append(new MenuItem({
      label: 'Save Image As...',
      click: () => chosen.resolve(() => webview.downloadURL(e.img)),
    }));

    menu.append(new MenuItem({
      label: 'Open Image in New Tab',
      click: () => chosen.resolve(function* () {
        yield put(PageEffects.createPageSession(e.img));
      }),
    }));
  }

  if (e.img || e.href) {
    menu.append(new MenuItem({ type: 'separator' }));
  }

  menu.append(new MenuItem({
    label: 'Inspect Element',
    click: () => chosen.resolve(() => webview.inspectElement(e.x, e.y)),
  }));

  menu.popup(remote.getCurrentWindow());
  const choice = yield chosen.promise;
  yield choice();
}

function* pinTab({ pageId, webContentsId }) {
  yield put(PageActions.setPagePinned(pageId));
  yield apply(ipcRenderer, ipcRenderer.send, ['guest-pinned-state', webContentsId, true]);
}

function* unpinTab({ pageId, webContentsId }) {
  yield put(PageActions.setPageUnpinned(pageId));
  yield apply(ipcRenderer, ipcRenderer.send, ['guest-pinned-state', webContentsId, false]);
}
