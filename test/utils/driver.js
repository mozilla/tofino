// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/
/* eslint object-shorthand: 0 */

import expect from 'expect';
import { Application } from 'spectron';
import { getRoot, getElectronPath } from '../../build/utils';
import startFixtureServer from '../utils/server';

// WebDriver takes unicode mappings to certain keys,
// like arrow and return.
// https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol#post-sessionsessionidelementidvalue
const TAB = '\uE004';
const RETURN = '\uE006';

const Driver = {
  app: null,

  start: async function() {
    expect(this.app).toBe(null, 'Attempting to start an already activated Electron instance');

    const server = startFixtureServer();

    this.app = new Application({
      path: getElectronPath(),
      args: [getRoot()],
      env: process.env,
    });

    await this.app.start();
    this.client = this.app.client;
    expect(this.app.isRunning()).toBe(true);
    await this.client.waitUntilWindowLoaded();

    // Wait for both BrowserWindow and first tab webview to exist
    await this.client.waitUntil(() => this.client.getWindowCount().then(count => count === 2));

    const { stop, port } = await server;
    this._stopServer = stop;
    this.port = port;
    return this.app;
  },

  stop: async function() {
    if (this.app && this.app.isRunning()) {
      await this.app.stop();
    }

    if (this._stopServer) {
      await this._stopServer();
    }

    this.app = this.port = this._stopServer = null;
  },

  waitForCurrentTabLoaded: async function() {
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
    await this.click('#browser-location-title-bar');
    await this.app.client
      .waitForVisible('#urlbar-input')
      .setValue('#urlbar-input', `${loc}${RETURN}`);
  },

  navigateBack: async function() {
    return await this.click('#browser-navbar-back');
  },

  navigateForward: async function() {
    return await this.click('#browser-navbar-forward');
  },

  /**
   * A bit hacky, but ensures we don't have the url bar focused
   */
  blur: async function() {
    // If our URL bar is visible, send a tab event
    if (await this.app.client.isVisible('#urlbar-input')) {
      await this.app.client.setValue('#urlbar-input', TAB);
    }
    return await this.app.client
      .waitForVisible('#browser-location-title-bar');
  },
};

export default Driver;
