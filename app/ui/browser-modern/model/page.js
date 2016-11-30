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

import { register } from '../util/record-constructors';
import { logger } from '../../../shared/logging';
import PageMeta from './page-meta';
import PageState from './page-state';
import PageUIState from './page-ui-state';
import { isHistoryRestoreUrl } from '../../shared/util/url-util';

const VERSION = 1;
const LOADING_TITLE = 'Loading…';

export default class Page extends register(Immutable.Record({
  id: '',
  location: '',
  title: '',
  faviconUrl: '',
  meta: new PageMeta(),
  state: new PageState(),
  uiState: new PageUIState(),
  history: Immutable.List(),
  historyIndex: -1,
  getTabTitle() {
    if (isHistoryRestoreUrl(this.location)) {
      return LOADING_TITLE;
    }
    return this.title || this.meta.title || this.location || LOADING_TITLE;
  },
}, `Page_v${VERSION}`)) {
  constructor(data) {
    if (!data || !data.id) {
      logger.warn('Required property `id` missing from page constructor.');
      super({ id: uuid.v4(), ...data });
    } else {
      super(data);
    }
  }
}
