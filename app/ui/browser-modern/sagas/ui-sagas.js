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

import { wrapped } from './helpers';
import * as EffectTypes from '../constants/effect-types';

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
  ];
}

function* focusURLBar({ urlbar, options = {} }) {
  urlbar.focus();
  if (options.select) {
    urlbar.select();
  }
}

function* setURLBarValue({ urlbar, value }) {
  urlbar.value = value;
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
