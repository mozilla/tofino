// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/
/* eslint object-shorthand: 0, global-require: 0 */

import expect from 'expect';
import { Application } from 'spectron';
import { getRoot, getElectronPath } from '../../build/utils';
import startFixtureServer from '../utils/server';

// WebDriver takes unicode mappings to certain keys,
// like arrow and return.
// https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#post-sessionsessionidelementidvalue
const TAB = '\uE004';
const RETURN = '\uE006';

// The timeout used in all webdriver 'wait' functions.
const WEBDRIVER_TIMEOUT_IN_MS = 10000;

// This is the timeout for webdriver to start up. Default is 5000.
// Sometimes this is not long enough, and not sure what we can even
// do to make this go faster.
const WEBDRIVER_START_TIMEOUT_IN_MS = 10000;

const Driver = {

  // Timeout used by test suites: `this.timeout(Driver.TEST_TIMEOUT_IN_MS)`
  TEST_TIMEOUT_IN_MS: 60000,

  app: null,
  fixturesURL: null,
  port: null,

  start: async function() {
    expect(this.app).toBe(null, 'Attempting to start an already activated Electron instance');

    const server = startFixtureServer();

    this.app = new Application({
      path: getElectronPath(),
      args: [getRoot()],
      env: process.env,
      startTimeout: WEBDRIVER_START_TIMEOUT_IN_MS,
      waitTimeout: WEBDRIVER_TIMEOUT_IN_MS,
    });

    // app.start() can take up to 30s on Appveyor Windows builds
    await this.app.start();

    this.client = this.app.client;
    expect(this.app.isRunning()).toBe(true);
    await this.client.waitUntilWindowLoaded();

    // See http://webdriver.io/api/protocol/timeouts.html and
    // http://www.seleniumhq.org/docs/04_webdriver_advanced.jsp.
    await this.client.timeouts('implicit', WEBDRIVER_TIMEOUT_IN_MS);

    // Wait for both BrowserWindow and first tab webview to exist
    await this.client.waitUntil(() => this.client.getWindowCount().then(count => count === 2));

    const { value: bwHandle } = await this.client.windowHandle();
    const { stop, port } = await server;

    this._bwHandle = bwHandle;
    this._stopServer = stop;
    this.port = port;
    this.fixturesURL = `http://localhost:${this.port}`;

    return this.app;
  },

  stop: async function() {
    if (this.app && this.app.isRunning()) {
      await this.app.stop();
    }

    if (this._stopServer) {
      await this._stopServer();
    }

    this.app = this.port = this.fixturesURL = this._stopServer = this._bwHandle = null;
  },

  /**
   * Fetches the redux state of the first browser window and returns
   * it as a plain JS object (de-immutable-ified).
   *
   * @return Promise<Object>
   */
  getReduxState: async function() {
    const oldHandle = await this.setTargetToBrowserWindow();

    try {
      return await this.client.execute(() =>
        JSON.stringify(require('electron').ipcRenderer.store.getState()))
        .then(res => JSON.parse(res.value));
    } finally {
      // Here's a situation where a decorator would be useful.
      if (oldHandle !== this._bwHandle) {
        await this.app.client.window(oldHandle);
      }
    }
  },

  /**
   * Polls the redux state of the first browser window
   * until the passed in predicate, which receives the state as a
   * plain JS Object, returns a truthy value, or resolves to a truthy value.
   *
   * @param {Function} predicate
   * @return Promise
   */
  waitUntilReduxState: async function(predicate) {
    let result = false;
    do {
      const state = await this.getReduxState();
      result = await predicate(state);
    } while (!result);
  },

  ipcSendToRenderer(channel, ...args) {
    this.app.electron.ipcRenderer.emit(channel, {}, ...args);
  },

  ipcSendToMain(channel, ...args) {
    this.app.electron.ipcRenderer.send(channel, ...args);
  },

  /**
   * Sets the webdriver target to the main browser window.
   */
  setTargetToBrowserWindow: async function() {
    const { value: oldHandle } = await this.app.client.windowHandle();
    await this.app.client.window(this._bwHandle);
    return oldHandle;
  },

  /**
   * Accepts a string url and iterates over the current
   * webdriver window handlers until one matches and updates
   * the context. Throws an error if not found.
   *
   * @param {String} url
   */
  setTargetByURL: async function(url) {
    const { value: handles } = await this.app.client.windowHandles();

    for (const handle of handles) {
      await this.app.client.window(handle);
      const { value: handleURL } = await this.client.url();
      if (handleURL === url) {
        return;
      }
    }

    throw new Error(`No valid webdriver handles found for ${url}`);
  },

  waitForCurrentTabLoaded: async function() {
    await this.setTargetToBrowserWindow();
    return await this.app.client
      .waitForVisible('.active-browser-page[data-page-state="loaded"]');
  },

  /**
   * Clicks the `selector` via waiting for its existence, moving and finally
   * left clicking.
   */
  click: async function(selector) {
    await this.app.client
      .waitForVisible(selector)
      .moveToObject(selector)
      .leftClick(selector);
    return this;
  },

  navigate: async function(loc) {
    await this.setTargetToBrowserWindow();
    await this.click('#browser-location-title-bar');
    await this.app.client
      .waitForVisible('#urlbar-input')
      .setValue('#urlbar-input', `${loc}${RETURN}`);
  },

  navigateBack: async function() {
    await this.setTargetToBrowserWindow();
    return await this.click('#browser-navbar-back');
  },

  navigateForward: async function() {
    await this.setTargetToBrowserWindow();
    return await this.click('#browser-navbar-forward');
  },

  getURLValue: async function() {
    const { value } = await Driver.client.execute(() =>
      document.querySelector('#urlbar-input').value
    );
    return value;
  },

  waitForURLValue: async function(val) {
    await Driver.client.waitUntil(() =>
      this.getURLValue().then(value => value === val),
    2000, 10);
  },

  /**
   * A bit hacky, but ensures we don't have the url bar focused
   */
  blur: async function() {
    await this.setTargetToBrowserWindow();

    // If our URL bar is visible, send a tab event
    if (await this.app.client.isVisible('#urlbar-input')) {
      await this.app.client.setValue('#urlbar-input', TAB);
    }
    return await this.app.client
      .waitForVisible('#browser-location-title-bar');
  },
};

export default Driver;
