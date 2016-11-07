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

import { call, apply, put } from 'redux-saga/effects';

import { logger } from '../../../shared/logging';
import { infallible, takeLatestMultiple } from '../../shared/util/saga-util';
import { ipcRenderer } from '../../../shared/electron';
import * as UIActions from '../actions/ui-actions';
import * as EffectTypes from '../constants/effect-types';
import { INTERACTION_TYPES } from '../../shared/widgets/search';

export default function*() {
  yield takeLatestMultiple({ infallible, logger },
    [EffectTypes.SET_APPLICATION_ACTIVE_ELEMENT, setActiveElement],
    [EffectTypes.FOCUS_URL_BAR, focusURLBar],
    [EffectTypes.SET_URL_BAR_VALUE, setURLBarValue],
    [EffectTypes.SHOW_DOWNLOAD_NOTIFICATION, showDownloadNotification],
    [EffectTypes.CONFIRM_DEFAULT_BROWSER, confirmDefaultBrowser],
  );
}

export function* setActiveElement({ owner, details }) {
  yield apply(ipcRenderer, ipcRenderer.send, ['guest-active-element', { owner, details }]);
  yield put(UIActions.setActiveElement(owner, details));
}

export function* focusURLBar({ urlbar, options = {} }) {
  yield apply(urlbar, urlbar.focus);

  if (options.select) {
    yield apply(urlbar, urlbar.select);
  }
}

export function* setURLBarValue({ urlbar, value, info = {}, options = { keepSelection: true } }) {
  // When the user is interacting with the url bar, don't just change all the
  // displayed text directly, only the default value, to prevent replacing
  // user entered text, but allowing the intended text to be displayed when
  // cancelling input (e.g. by pressing 'Escape').
  const interaction = urlbar.dataset.interaction;
  const focused = urlbar.dataset.focused;
  if (focused || interaction !== INTERACTION_TYPES.IDLE) {
    if (focused) {
      logger.warn('Skipped setting `value` on the urlbar because of focus.');
    } else {
      logger.warn(`Skipped setting \`value\` on the urlbar because: ${interaction}.`);
    }
    urlbar.defaultValue = value;
    return;
  }

  const { selectionStart, selectionEnd } = urlbar;
  const isAllTextSelected = selectionStart === 0 && selectionEnd === urlbar.value.length;

  urlbar.value = value;
  urlbar.defaultValue = value;

  // Changing the displayed text would clear selection, which we may not want
  // if the entire contents of the input element were previously selected.
  if (options.keepSelection && info.isActiveElement && isAllTextSelected) {
    yield apply(urlbar, urlbar.select);
  }
}

export function* showDownloadNotification({ path, filename, status }) {
  let message;
  const title = `Download ${status === 'success' ? 'completed' : 'failed'}`;

  if (status === 'success') {
    message = `Download for ${filename} is completed. Can be located at ${path}/${filename}`;
  } else if (status === 'error') {
    message = `Download for ${filename} has failed.`;
  }

  // Spawn a Web Notification
  // https://developer.mozilla.org/en-US/docs/Web/API/notification
  new Notification(title, { body: message }); //eslint-disable-line
}

export function* confirmDefaultBrowser() {
  const message = 'Would you like to be Tofino your default browser?';
  if (yield call(confirm, message)) {
    yield apply(ipcRenderer, ipcRenderer.send, ['set-default-browser']);
  }
}
