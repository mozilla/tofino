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

/* eslint global-require: 0 */
/* eslint import/no-mutable-exports: 0 */

import BUILD_CONFIG from '../build-config';

let perf;
if (BUILD_CONFIG.development) {
  perf = require('react-addons-perf'); // eslint-disable-line
} else {
  perf = {
    start() {},
    stop() {},
    printWasted() {},
    getLastMeasurements() {},
  };
}

export default perf;
