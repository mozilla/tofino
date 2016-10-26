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

import { call } from 'redux-saga/effects';

import { logger } from '../../../shared/logging';
import { infallible, takeLatestMultiple } from '../../shared/util/saga-util';
import * as EffectTypes from '../constants/effect-types';
import BUILD_CONFIG from '../../../build-config';

/**
 * This file contains actions used only in development mode -- handling
 * measuring react performance, for example. These are stubbed out in
 * non-development mode.
 */
let Perf;
if (BUILD_CONFIG.development) {
  Perf = require('react-addons-perf'); // eslint-disable-line
} else {
  Perf = {
    start() {},
    stop() {},
    printWasted() {},
    getLastMeasurements() {},
  };
}

export default function*() {
  yield takeLatestMultiple(
    [EffectTypes.PERF_RECORD_START, infallible(perfStart, logger)],
    [EffectTypes.PERF_RECORD_STOP, infallible(perfStop, logger)],
  );
}

export function* perfStart() {
  yield call(Perf.start);
}

export function* perfStop() {
  yield call(Perf.stop);
  yield call(Perf.printWasted, yield call(Perf.getLastMeasurements));
}
