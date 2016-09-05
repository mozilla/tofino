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
import * as PageEffects from './actions/page-effects';

export default function({ store }) {
  const container = document.getElementById('browser-container');

  // Before rendering, add a fresh page. This is leading toward a session restore
  // model where the main process can instantiate a mostly-formed browser window.
  // The reason to dispatch actions is that some actions start asynchronous processes,
  // and we can't necessarily produce the resulting state (which is supposed to be
  // the initial state presented to the user). Dispatching actions also uses the
  // same codepaths the rest of the application uses.

  // We can dispatch our fresh page before connecting to the UA service.
  store.dispatch(PageEffects.createPageSession());

  // We start rendering before we connect to the UA service and before we receive
  // the initial state so that if an error occurs while we connect, we at least
  // have some UI in place.
  ReactDOM.render(<Provider store={store}><App /></Provider>, container);
}
