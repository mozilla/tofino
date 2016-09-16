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

import uuid from 'uuid';

import { getWebViewForPageId } from '../util';
import * as EffectTypes from '../constants/effect-types';
import * as PagesSelectors from '../selectors/pages';
import PageState from '../model/page-state';

export function createPageSession(location, options) {
  return {
    type: EffectTypes.CREATE_PAGE_SESSION,
    id: uuid.v4(),
    location,
    options,
  };
}

export function destroyPageSession(pageId) {
  return (dispatch, getState) => {
    dispatch({
      type: EffectTypes.DESTROY_PAGE_SESSION,
      page: PagesSelectors.getPageById(getState(), pageId),
      currentPageCount: PagesSelectors.getOrderedPageIds(getState()).size,
    });
  };
}

export function destroyCurrentPageSession() {
  return (dispatch, getState) => {
    dispatch(destroyPageSession(PagesSelectors.getSelectedPageId(getState())));
  };
}

export function navigatePageTo(pageId, location, doc = document) {
  return {
    type: EffectTypes.NAVIGATE_PAGE_TO,
    webview: getWebViewForPageId(doc, pageId),
    pageId,
    location,
  };
}

export function navigateCurrentPageTo(location) {
  return (dispatch, getState) => {
    dispatch(navigatePageTo(PagesSelectors.getSelectedPageId(getState()), location));
  };
}

export function navigatePageBack(pageId, doc = document) {
  return {
    type: EffectTypes.NAVIGATE_PAGE_BACK,
    webview: getWebViewForPageId(doc, pageId),
    pageId,
  };
}

export function navigateCurrentPageBack() {
  return (dispatch, getState) => {
    dispatch(navigatePageBack(PagesSelectors.getSelectedPageId(getState())));
  };
}

export function navigatePageForward(pageId, doc = document) {
  return {
    type: EffectTypes.NAVIGATE_PAGE_FORWARD,
    webview: getWebViewForPageId(doc, pageId),
    pageId,
  };
}

export function navigateCurrentPageForward() {
  return (dispatch, getState) => {
    dispatch(navigatePageForward(PagesSelectors.getSelectedPageId(getState())));
  };
}

export function navigatePageRefresh(pageId, doc = document) {
  return {
    type: EffectTypes.NAVIGATE_PAGE_REFRESH,
    webview: getWebViewForPageId(doc, pageId),
    pageId,
  };
}

export function navigateCurrentPageRefresh() {
  return (dispatch, getState) => {
    dispatch(navigatePageRefresh(PagesSelectors.getSelectedPageId(getState())));
  };
}

export function toggleDevtools(pageId, doc = document) {
  return {
    type: EffectTypes.TOGGLE_DEVTOOLS,
    webview: getWebViewForPageId(doc, pageId),
  };
}

export function toggleCurrentPageDevtools() {
  return (dispatch, getState) => {
    dispatch(toggleDevtools(PagesSelectors.getSelectedPageId(getState())));
  };
}

export function setPageZoomLevel(pageId, zoomLevel, doc = document) {
  return {
    type: EffectTypes.SET_PAGE_ZOOM_LEVEL,
    webview: getWebViewForPageId(doc, pageId),
    pageId,
    zoomLevel,
  };
}

export function setCurrentPageZoomLevel(zoomLevel) {
  return (dispatch, getState) => {
    dispatch(setPageZoomLevel(PagesSelectors.getSelectedPageId(getState()), zoomLevel));
  };
}

export function performPageZoomIn(pageId) {
  return (dispatch, getState) => {
    let zoomLevel = PagesSelectors.getPageZoomLevel(getState(), pageId);
    zoomLevel += PageState.ZOOM_LEVEL_10_PERCENT;
    dispatch(setPageZoomLevel(pageId, zoomLevel));
  };
}

export function performCurrentPageZoomIn() {
  return (dispatch, getState) => {
    dispatch(performPageZoomIn(PagesSelectors.getSelectedPageId(getState())));
  };
}

export function performPageZoomOut(pageId) {
  return (dispatch, getState) => {
    let zoomLevel = PagesSelectors.getPageZoomLevel(getState(), pageId);
    zoomLevel -= PageState.ZOOM_LEVEL_10_PERCENT;
    dispatch(setPageZoomLevel(pageId, zoomLevel));
  };
}

export function performCurrentPageZoomOut() {
  return (dispatch, getState) => {
    dispatch(performPageZoomOut(PagesSelectors.getSelectedPageId(getState())));
  };
}

export function performPageZoomReset(pageId) {
  return dispatch => {
    dispatch(setPageZoomLevel(pageId, PageState.ZOOM_LEVEL_DEFAULT));
  };
}

export function performCurrentPageZoomReset() {
  return (dispatch, getState) => {
    dispatch(performPageZoomReset(PagesSelectors.getSelectedPageId(getState())));
  };
}

export function performPageSearch(pageId, text, doc = document) {
  return {
    type: EffectTypes.PERFORM_PAGE_SEARCH,
    webview: getWebViewForPageId(doc, pageId),
    text,
  };
}

export function performCurrentPageSearch(text) {
  return (dispatch, getState) => {
    dispatch(performPageSearch(PagesSelectors.getSelectedPageId(getState()), text));
  };
}

export function capturePage(pageId, doc = document) {
  return {
    type: EffectTypes.CAPTURE_PAGE,
    webview: getWebViewForPageId(doc, pageId),
    pageId,
  };
}

export function captureCurrentPage() {
  return (dispatch, getState) => {
    dispatch(capturePage(PagesSelectors.getSelectedPageId(getState())));
  };
}

export function getCertificateError(pageId, url) {
  return {
    type: EffectTypes.GET_CERTIFICATE_ERROR,
    pageId,
    url,
  };
}
