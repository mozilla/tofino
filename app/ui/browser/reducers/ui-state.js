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

import 'babel-polyfill';

import * as types from '../constants/action-types';
import { UIState } from '../model';

const initialState = new UIState();

export default function uiState(state = initialState, action) {
  switch (action.type) {
    case types.SET_STATUS_TEXT:
      return state.set('statusText', action.text);

    case types.LOCATION_CHANGED:

      // Fallthrough.
    case types.SET_USER_TYPED_LOCATION:
      return state.setIn(['userTypedLocation', action.pageId], action.payload.text);

    default:
      return state;
  }
}
