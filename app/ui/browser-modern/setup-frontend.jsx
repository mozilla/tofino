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

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from './views/app';
import { serializeNode } from '../shared/util/dom-serializers';
import * as UIEffects from './actions/ui-effects';

export default function({ store }) {
  const container = document.getElementById('browser-container');

  // Track details about the currently focused elements in the app state.
  document.addEventListener('blur', () => {
    store.dispatch(UIEffects.setChromeActiveElement(null));
  }, true);

  document.addEventListener('focus', () => {
    // We shouldn't send the element itself, only some data about it, since
    // app state is intended to be immutable and easily serializable.
    // Furthermore, when focus is in the page content, we won't be able to send
    // the dom node itself via ipc anyway.
    store.dispatch(UIEffects.setChromeActiveElement(serializeNode(document.activeElement)));
  }, true);

  // We start rendering before we connect to the UA service and before we receive
  // the initial state so that if an error occurs while we connect, we at least
  // have some UI in place.
  ReactDOM.render(<Provider store={store}><App /></Provider>, container);
}
