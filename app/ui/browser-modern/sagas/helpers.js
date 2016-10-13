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

import { put } from 'redux-saga/effects';
import { logger } from '../../../shared/logging';

export const failed = type => ({ type: `${type}_FAILED` });

export const wrapped = function(pattern, fn, name) {
  if (typeof pattern === 'string') {
    name = name || fn.name || pattern;
  } else if (pattern instanceof Function) {
    name = name || fn.name || 'PREDICATE';
  } else if (pattern instanceof Array) {
    name = name || fn.name || `ARRAY:[${pattern}]`;
  } else if (pattern instanceof RegExp) {
    return wrapped(action => action.type.match(pattern), fn);
  } else {
    throw new Error(`Unsupported redux-saga pattern: ${pattern}`);
  }

  const generator = function*(...args) {
    try {
      yield* fn(...args);
    } catch (e) {
      yield put(failed(name));
      logger.error(e);
    }
  };

  Object.defineProperty(generator, 'name', { value: name });
  return [pattern, generator];
};
