/* @flow */

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

import * as endpoints from '../../../shared/constants/endpoints';

export default function(url: string, options: ?Object) {
  const newOptions = Object.assign({}, options);
  if (!newOptions.headers) {
    newOptions.headers = {};
  }
  newOptions.headers['Accept'] = 'application/json'; // eslint-disable-line
  newOptions.headers['Content-Type'] = 'application/json';

  if (!newOptions.body && newOptions.json instanceof Object) {
    newOptions.body = JSON.stringify(newOptions.json);
  }

  return fetch(`${endpoints.UA_SERVICE_HTTP}${url}`, newOptions);
}
