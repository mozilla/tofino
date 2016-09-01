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

import Immutable from 'immutable';
import uuid from 'uuid';

import PageMeta from './page-meta';

export default class Page extends Immutable.Record({
  id: '',
  location: '',
  title: '',
  canGoBack: false,
  canGoForward: false,
  canRefresh: false,
  meta: new PageMeta(),
}, 'Page') {
  constructor(data) {
    super({ ...data, id: uuid.v4() });
  }
}
