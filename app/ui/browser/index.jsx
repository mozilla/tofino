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
import { ipcRenderer } from '../../shared/electron';

import App from './views/app';
import configureStore from './store/store';
import rootReducer from './reducers';
import Immutable from 'immutable';

const initialProfileState = ipcRenderer.sendSync('window-loaded');

const initialState = rootReducer(undefined, { type: null });
initialState.browserWindow = initialState.browserWindow
  .setIn(['profile', 'bookmarks'], new Immutable.Set(initialProfileState.bookmarks));
const store = configureStore(initialState);

const chrome = (
  <Provider store={store}>
    <App />
  </Provider>
);

const container = document.getElementById('browser-container');

const onRender = () => ipcRenderer.send('window-ready');

ReactDOM.render(chrome, container, onRender);
