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
import { put, call } from 'redux-saga/effects';

import { wrapped } from './helpers';
import PageState from '../model/page-state';
import * as UserAgent from '../../shared/util/user-agent';
import * as PageActions from '../actions/page-actions';
import * as PageEffects from '../actions/page-effects';
import * as ProfileEffects from '../actions/profile-effects';
import * as UIEffects from '../actions/ui-effects';
import * as EffectTypes from '../constants/effect-types';

export default function() {
  return [
    function*() {
      yield* takeEvery(...wrapped(EffectTypes.CREATE_PAGE_SESSION, createPageSession));
    },
    function*() {
      yield* takeEvery(...wrapped(EffectTypes.DESTROY_PAGE_SESSION, destroyPageSession));
    },
    function*() {
      yield* takeLatest(...wrapped(EffectTypes.NAVIGATE_PAGE_TO, naviatePageTo));
    },
    function*() {
      yield* takeLatest(...wrapped(EffectTypes.NAVIGATE_PAGE_BACK, navigatePageBack));
    },
    function*() {
      yield* takeLatest(...wrapped(EffectTypes.NAVIGATE_PAGE_FORWARD, navigatePageForward));
    },
    function*() {
      yield* takeLatest(...wrapped(EffectTypes.NAVIGATE_PAGE_REFRESH, navigatePageRefresh));
    },
    function*() {
      yield* takeLatest(...wrapped(EffectTypes.TOGGLE_DEVTOOLS, toggleDevtools));
    },
    function*() {
      yield* takeLatest(...wrapped(EffectTypes.PERFORM_PAGE_SEARCH, performPageSearch));
    },
    function*() {
      yield* takeLatest(...wrapped(EffectTypes.SET_PAGE_ZOOM_LEVEL, setPageZoomLevel));
    },
    function*() {
      yield* takeLatest(...wrapped(EffectTypes.CAPTURE_PAGE, capturePage));
    },
  ];
}

function* createPageSession({ id, location, options }) {
  yield call(UserAgent.createSession, id, {});
  yield put(PageActions.createPage(id, location, options));
}

function* destroyPageSession({ page, currentPageCount }) {
  yield call(UserAgent.destroySession, page, {});
  yield put(PageActions.removePage(page.id));

  // If the last page was removed, dispatch an action to create another one.
  if (currentPageCount === 1) {
    yield put(PageEffects.createPageSession());
  }
}

function* naviatePageTo({ pageId, webview, location }) {
  yield put(PageActions.resetPageData(pageId));
  yield put(PageActions.setPageState(pageId, { load: PageState.STATES.PRE_LOADING }));
  // Optimistically set page location and update the urlbar before the actual
  // navigation happens, so that the UI shows the intended location instead of
  // just some blank text.
  yield put(PageActions.setPageDetails(pageId, { location }));
  yield put(UIEffects.setURLBarValue(pageId, location));
  webview.setAttribute('src', location);
}

function* navigatePageBack({ pageId, webview }) {
  yield put(PageActions.resetPageData(pageId));
  yield put(PageActions.setPageState(pageId, { load: PageState.STATES.PRE_LOADING }));
  webview.goBack();
}

function* navigatePageForward({ pageId, webview }) {
  yield put(PageActions.resetPageData(pageId));
  yield put(PageActions.setPageState(pageId, { load: PageState.STATES.PRE_LOADING }));
  webview.goForward();
}

function* navigatePageRefresh({ pageId, webview }) {
  yield put(PageActions.resetPageData(pageId));
  yield put(PageActions.setPageState(pageId, { load: PageState.STATES.PRE_LOADING }));
  webview.reload();
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
  yield put(PageActions.setPageState(pageId, { zoomLevel }));
}

function* capturePage({ pageId, webview }) {
  const script = 'window._readerify(window.document)';

  const readerResult = yield new Promise((resolve, reject) => {
    webview.executeJavaScript(script, false, result => {
      if (!result) {
        reject(new Error(`Could not capture page ${pageId}.`));
      } else {
        resolve(result);
      }
    });
  });

  yield put(ProfileEffects.addCapturedPage(pageId, readerResult));
}
