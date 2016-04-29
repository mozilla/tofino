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
    await this.app.client
      .waitForVisible('.active-browser-page[data-page-state="loaded"]');
  },

  navigate: async function(loc) {
    await this.app.client
      .waitForVisible('#browser-location-title-bar')
      .moveToObject('#browser-location-title-bar')
      .leftClick('#browser-location-title-bar')
      .waitForVisible('#urlbar-input')
      .setValue('#urlbar-input', `${loc}${RETURN}`);
  },

  navigateBack: async function() {
    await this.app.client
      .waitForVisible('#browser-navbar-back')
      .moveToObject('#browser-navbar-back')
      .leftClick('#browser-navbar-back');
  },

  navigateForward: async function() {
    await this.app.client
      .waitForVisible('#browser-navbar-forward')
      .moveToObject('#browser-navbar-forward')
      .leftClick('#browser-navbar-forward');
  },

  /**
   * A bit hacky, but ensures we don't have the url bar focused
   */
  blur: async function() {
    // If our URL bar is visible, send a tab event
    if (await this.app.client.isVisible('#urlbar-input')) {
      await this.app.client.setValue('#urlbar-input', TAB);
    }
    await this.app.client
      .waitForVisible('#browser-location-title-bar');
  },
};

export default Driver;
