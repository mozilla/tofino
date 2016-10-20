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

import { takeLatest, takeEvery, throttle } from 'redux-saga';
import { cancel } from 'redux-saga/effects';

export class Watcher {
  constructor(pattern, cb, interval = 0) {
    this.pattern = pattern;
    this.cb = cb;
    this.interval = interval;
    this._task = null;
  }

  isRunning() {
    return this._task && this._task.isRunning();
  }

  * startIfNotRunning() {
    if (!this.isRunning()) {
      this._task = yield throttle(this.interval, this.pattern, this.cb);
    }
  }

  * cancelIfRunning() {
    if (this.isRunning()) {
      yield cancel(this._task);
      this._task = null;
    }
  }
}

export const takeLatestMultiple = function(...patterns) {
  return patterns.map(([pattern, fn, ...args]) => takeLatest(pattern, fn, ...args));
};

export const takeEveryMultiple = function(...patterns) {
  return patterns.map(([pattern, fn, ...args]) => takeEvery(pattern, fn, ...args));
};

export const infallible = function(fn, logger) {
  if (!logger || !('error' in logger)) {
    throw new Error('A logger with an `error` method is required.');
  }

  const generator = function*(...args) {
    try {
      yield* fn(...args);
    } catch (e) {
      if (e instanceof Error) {
        logger.error(e);
      } else if (e instanceof Response) {
        logger.error('Errored while performing a `fetch`.');
      } else {
        logger.error('Something quite terrible has happened.');
      }
    }
  };

  Object.defineProperty(generator, 'name', { value: `infallible(${fn.name})` });
  return generator;
};
