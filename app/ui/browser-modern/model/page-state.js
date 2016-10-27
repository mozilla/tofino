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
import SSLCertificate from './ssl-certificate';

const VERSION = 1;

const PageState = register(Immutable.Record({
  load: '', // PageState.STATES
  navigationType: '', // PageState.NAVIGATION_TYPES
  code: -1, // HTTP code
  description: '', // HTTP description

  // https://github.com/electron/electron/blob/master/docs/api/app.md#event-certificate-error
  error: '',
  certificate: new SSLCertificate(),

}, `PageState_v${VERSION}`));

PageState.STATES = {
  CONNECTING: 'connecting',
  LOADING: 'loading',
  LOADED: 'loaded',
  FAILED: 'failed',
};

PageState.NAVIGATION_TYPES = {
  NAVIGATED_TO_LOCATION: 'navigated-to-location',
  NAVIGATED_BACK: 'navigated-back',
  NAVIGATED_FORWARD: 'navigated-forward',
  REFRESHED: 'refreshed',
  NAVIGATED_IN_HISTORY: 'navigated-in-history',
};

export default PageState;
