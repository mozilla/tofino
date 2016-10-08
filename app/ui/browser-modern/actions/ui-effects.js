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

import { getURLBarForPageId } from '../util';
import ActiveElement from '../model/active-element';
import * as EffectTypes from '../constants/effect-types';
import * as PagesSelectors from '../selectors/pages';

export function setApplicationActiveElement(owner, details) {
  return {
    type: EffectTypes.SET_APPLICATION_ACTIVE_ELEMENT,
    owner,
    details,
  };
}

export function setChromeActiveElement(details) {
  return setApplicationActiveElement(ActiveElement.OWNER.CHROME, details);
}

export function setContentActiveElement(details) {
  return setApplicationActiveElement(ActiveElement.OWNER.CONTENT, details);
}

export function focusURLBar(pageId, options, doc = document) {
  return {
    type: EffectTypes.FOCUS_URL_BAR,
    urlbar: getURLBarForPageId(doc, pageId),
    options,
  };
}

export function focusCurrentURLBar(options) {
  return (dispatch, getState) => {
    dispatch(focusURLBar(PagesSelectors.getSelectedPageId(getState()), options));
  };
}

export function setURLBarValue(pageId, value, options, doc = document) {
  return {
    type: EffectTypes.SET_URL_BAR_VALUE,
    urlbar: getURLBarForPageId(doc, pageId),
    value,
    options,
    doc,
  };
}

export function setCurrentURLBarValue(value, options) {
  return (dispatch, getState) => {
    dispatch(setURLBarValue(PagesSelectors.getSelectedPageId(getState()), value, options));
  };
}

export function showDownloadNotification({ url, filename, status }) {
  return {
    type: EffectTypes.SHOW_DOWNLOAD_NOTIFICATION,
    url,
    filename,
    status,
  };
}

export function confirmDefaultBrowser() {
  return {
    type: EffectTypes.CONFIRM_DEFAULT_BROWSER,
  };
}
