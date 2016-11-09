// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';

import { takeLatest } from 'redux-saga';
import { call } from 'redux-saga/effects';
import main, * as DeveloperSagas from '../../../../app/ui/browser-modern/sagas/developer-sagas';
import * as EffectTypes from '../../../../app/ui/browser-modern/constants/effect-types';
import Perf from '../../../../app/shared/perf';

describe('developer sagas', () => {
  it('should listen to the appropriate actions', () => {
    const gen = main();
    expect(gen.next().value.meta).toEqual({
      type: takeLatest,
      patterns: [
        [EffectTypes.PERF_RECORD_START, DeveloperSagas.perfStart],
        [EffectTypes.PERF_RECORD_STOP, DeveloperSagas.perfStop],
      ],
    });
    expect(gen.next().done).toEqual(true);
  });

  it('should be able to start recording performance', () => {
    const gen = DeveloperSagas.perfStart();
    expect(gen.next().value).toEqual(call(Perf.start));
    expect(gen.next().done).toEqual(true);
  });

  it('should be able to stop recording performance and print measurements', () => {
    const gen = DeveloperSagas.perfStop();
    expect(gen.next().value).toEqual(call(Perf.stop));
    expect(gen.next().value).toEqual(call(Perf.getLastMeasurements));
    const measurements = [1, 2, 3];
    expect(gen.next(measurements).value).toEqual(call(Perf.printWasted, measurements));
    expect(gen.next().done).toEqual(true);
  });
});
