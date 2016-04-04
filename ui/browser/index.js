
import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ipcRenderer } from 'electron';
import App from './views/app.jsx';
import configureStore from './store/store';

const store = configureStore();

/**
 * Hot Module Reload
 */
// if (module.hot) {
//   module.hot.accept();
// }

const container = document.getElementById('browser-container');

const app = React.createElement(App);
const chrome = React.createElement(Provider, { store }, app);

const onRender = () => ipcRenderer.send('window-ready');

render(chrome, container, onRender);
