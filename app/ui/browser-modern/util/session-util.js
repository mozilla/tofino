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

import transit from 'transit-immutable-js';

import { logger } from '../../../shared/logging';
import { getAllRegisteredRecords } from './record-constructors';

export function serializeAppState(state) {
  // Save the entire app state for now. If for some reason we need to
  // filter or massage the current store shape before saving, do it here.
  const records = getAllRegisteredRecords();
  return transit.withRecords(records).toJSON(state);
}

export function deserializeAppState(string) {
  const records = getAllRegisteredRecords();
  return transit.withRecords(records, (name, value) => {
    logger.warn(`Missing \`${name}\` record when serializing app state.`);
    logger.warn('Ignoring field:', value);
    return undefined;
  }).fromJSON(string);
}
