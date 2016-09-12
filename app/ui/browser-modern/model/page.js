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

import { logger } from '../../../shared/logging';
import PageMeta from './page-meta';
import PageState from './page-state';

export default class Page extends Immutable.Record({
  id: undefined,
  location: '',
  title: '',
  favicon_url: undefined,
  meta: new PageMeta(),
  state: new PageState(),
}, 'Page') {
  constructor(data) {
    if (!data.id) {
      logger.warn('Required property `id` missing from page constructor.');
      super({ id: uuid.v4(), ...data });
    } else {
      super(data);
    }
  }
}
