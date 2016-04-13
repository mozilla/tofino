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

import path from 'path';
import { packaged, projectPath, development } from '../build-config';

import { remote } from 'electron';
const app = remote.require('app');

/**
 * When you want to create a new object containing mutated keys/values compared
 * to another object.
 * A shallow clone of an object could be achieved like this:
 *     const clone = mapObject(orig, ([key, value]) => [key, value]);
 * @param source object to be used as a reference
 * @param mapper function that is passed each of the entries
 * (i.e. [key, value]) in the source object, and is expected to return
 * similar mutated entries
 */
export function mapObject(source, mapper) {
  const entries = Object.entries(source);
  const newEntries = entries.map(mapper);

  const dest = {};
  newEntries.forEach(([newKey, newValue]) => { dest[newKey] = newValue; });
  return dest;
}

/**
 * Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * N milliseconds.
 */
export function debounce(func, wait) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      timeout = null;
      func(...args);
    }, wait);
  };
}

/**
 * Whether or not hot reloading and minified files should be used
 */
export function isProduction() {
  return !development;
}

/**
 * Returns an absolute path to the project root. When packaged, this will return
 * a string pointing to a file in Electron's asar store.
 */
export function getFilePathToRoot() {
  if (packaged) {
    return app.getAppPath();
  } else {
    return projectPath;
  }
}
