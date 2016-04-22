/* eslint prefer-arrow-callback: 0 */

import path from 'path';
import expect from 'expect';
import { Application } from 'spectron';
import * as BuildUtils from '../../build/utils';
import { quickTest } from '../../build-config';
import os from "os";

// import ChromeDriver from './chrome-driver';
import DevNull from 'dev-null';
import * as WebDriver from 'webdriverio';

const root = path.join(__dirname, '..', '..');
const dist = path.resolve(path.join(root, "dist", "tofino-" + os.platform() + "-x64"));
let command = dist;
if (os.platform() == "win32") {
  command = path.join(command, "tofino.exe");
} else {
  command = path.join(command, "tofino");
}

describe('application launch', function() {
  if (quickTest) {
    it.skip('all tests');
    return;
  }

  this.timeout(30000);

  beforeEach(function(done) {
    try {
      /* eslint no-console: 0, prefer-template: 0, arrow-body-style: 0,
      new-cap: 0, lines-around-comment: 0 */
      this.app = new Application({
        path: command,
        env: process.env,
        cwd: dist,
      });

      this.app.exists().then(() => {
        return this.app.startChromeDriver();
      }).then(() => {
        return new Promise((resolve, reject) => {
          const args = [];
          args.push('spectron-path=' + this.app.path);
          this.app.args.forEach((arg, index) => {
            args.push('spectron-arg' + index + '=' + arg);
          });

          for (const name of Object.keys(this.app.env)) {
            args.push('spectron-env-' + name + '=' + this.app.env[name]);
          }

          let launcherPath = null;
          const spectronPath = path.join(__dirname, '..', '..', 'node_modules', 'spectron');
          if (process.platform === 'win32') {
            launcherPath = path.join(spectronPath, 'bin', 'launcher.exe');
          } else {
            launcherPath = path.join(spectronPath, 'lib', 'launcher.js');
          }

          if (process.env.APPVEYOR) {
            args.push('no-sandbox');
          }

          const options = {
            host: this.app.host,
            port: this.app.port,
            waitforTimeout: this.app.waitTimeout,
            connectionRetryCount: this.app.connectionRetryCount,
            connectionRetryTimeout: this.app.connectionRetryTimeout,
            desiredCapabilities: {
              browserName: 'electron',
              chromeOptions: {
                binary: launcherPath,
                args,
              },
            },
            // logOutput: DevNull(),
            logLevel: 'verbose',
          };

          this.app.client = WebDriver.remote(options);
          this.app.addCommands();
          console.log('beforeEach 3');

          const maxTries = 10;
          let tries = 0;

          const init = () => {
            tries++;
            console.log('beforeEach 4-1', tries);
            this.app.client.init().then(arg => {
              console.log('beforeEach 4-2', arg);
              resolve(arg);
            }).catch(error => {
              console.log('beforeEach 4-err', error);

              if (tries >= maxTries) {
                error.message = 'Client initialization failed after ' + tries + ' attempts: ';
                error.message += error.type + ' ' + error.message;
                reject(error);
              } else {
                global.setTimeout(init, 250);
              }
            });
          };
          init();

          console.log('beforeEach 2');
        });
      }).then(() => {
        console.log('beforeEach 5');
        this.app.running = true;
        console.log('beforeEach 6');
        done();
      }).catch(ex => {
        console.log('beforeEach .catch', ex.stack);
        console.error(ex);
      });
    } catch (ex) {
      console.log('beforeEach catch', ex);
    }
  });

  it('shows an initial window', async function() {
    const count = await this.app.client.getWindowCount();
    expect(count).toEqual(1);
  });

  afterEach(function() {
    if (this.app && this.app.isRunning()) {
      return this.app.stop();
    }
    return undefined;
  });
});
