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

import { takeLatest } from 'redux-saga';

import { ipcRenderer } from '../../../shared/electron';
import { wrapped } from './helpers';
import { logger } from '../../../shared/logging';
import * as EffectTypes from '../constants/effect-types';
import { INTERACTION_TYPES } from '../../shared/widgets/search';

export default function() {
  return [
    function*() {
      yield* takeLatest(...wrapped(EffectTypes.FOCUS_URL_BAR, focusURLBar));
    },
    function*() {
      yield* takeLatest(...wrapped(EffectTypes.SET_URL_BAR_VALUE, setURLBarValue));
    },
    function*() {
      yield* takeLatest(...wrapped(EffectTypes.SHOW_DOWNLOAD_NOTIFICATION,
            showDownloadNotification));
    },
    function*() {
      yield* takeLatest(...wrapped(EffectTypes.CONFIRM_DEFAULT_BROWSER, confirmDefaultBrowser));
    },
  ];
}

function* focusURLBar({ urlbar, options = {} }) {
  urlbar.focus();

  if (options.select) {
    urlbar.select();
  }
}

function* setURLBarValue({ urlbar, value, doc, options = { keepSelection: true } }) {
  // When the user is interacting with the url bar, don't just change all the
  // displayed text directly, only the default value, to prevent replacing
  // user entered text, but allowing the intended text to be displayed when
  // cancelling input (e.g. by pressing 'Escape').
  const interaction = urlbar.dataset.interaction;
  if (interaction === INTERACTION_TYPES.USER_IS_TYPING) {
    logger.warn(`Skipped setting \`value\` on the urlbar because: ${interaction}.`);
    urlbar.defaultValue = value;
    return;
  }

  const { selectionStart, selectionEnd } = urlbar;
  const allTextSelected = selectionStart === 0 && selectionEnd === urlbar.value.length;
  const isActiveElement = doc.activeElement === urlbar;

  urlbar.value = value;
  urlbar.defaultValue = value;

  // Changing the displayed text would clear selection, which we may not want
  // if the entire contents of the input element were previously selected.
  if (options.keepSelection && isActiveElement && allTextSelected) {
    urlbar.select();
  }
}

function* showDownloadNotification({ filename, status }) {
  let message;
  const title = `Download ${status === 'success' ? 'completed' : 'failed'}`;

  if (status === 'success') {
    message = `Download for ${filename} is completed.`;
  } else if (status === 'error') {
    message = `Download for ${filename} has failed.`;
  }

  // Spawn a Web Notification
  // https://developer.mozilla.org/en-US/docs/Web/API/notification
  new Notification(title, { body: message }); //eslint-disable-line
}

function* confirmDefaultBrowser() {
  /* eslint-disable no-alert */
  if (confirm('Would you like to be Tofino your default browser?')) {
    ipcRenderer.send('set-default-browser');
  }
  /* eslint-enable no-alert */
}
