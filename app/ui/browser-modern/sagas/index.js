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

import developer from './developer-sagas';
import external from './external-sagas';
import profile from './profile-sagas';
import page from './page-sagas';
import ui from './ui-sagas';

export default function*() {
  yield [
    ...developer().map(f => f()),
    ...external().map(f => f()),
    ...profile().map(f => f()),
    ...page().map(f => f()),
    ...ui().map(f => f()),
  ];
}
