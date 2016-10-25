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

import { register } from '../util/record-constructors';

const VERSION = 1;

const PageUIState = register(Immutable.Record({
  preventInteraction: false,
  zoomLevel: 0,
  searchVisible: false,
  searchFocused: false,
  pinned: false,
}, `PageUIState_v${VERSION}`));

// See http://electron.atom.io/docs/api/web-view-tag/#webviewsetzoomlevellevel
PageUIState.ZOOM_LEVEL_DEFAULT = 0;
PageUIState.ZOOM_LEVEL_10_PERCENT = 0.5;

export default PageUIState;
