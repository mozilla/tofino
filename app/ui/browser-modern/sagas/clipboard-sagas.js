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

import { apply } from 'redux-saga/effects';

import { logger } from '../../../shared/logging';
import { infallible, takeLatestMultiple } from '../../shared/util/saga-util';
import { clipboard } from '../../../shared/electron';
import * as EffectTypes from '../constants/effect-types';

export default function*() {
  yield takeLatestMultiple({ infallible, logger },
    [EffectTypes.COPY_TEXT_TO_CLIPBOARD, copyTextToClipboard],
  );
}

export function* copyTextToClipboard({ text }) {
  yield apply(clipboard, clipboard.writeText, [text]);
}
