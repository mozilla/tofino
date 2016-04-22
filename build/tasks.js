// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/**
 * Use need to allow lazy loading of modules for all tasks. Generally,
 * we assume `build-config.js` exists, however *during* the build process
 * this might not be true, which will break certain native module imports that
 * try to eagerly load this file.
 */

export default {
  async config(options) {
    await require('./task-config-builder').default(options);
  },

  async build() {
    await this.config({ development: false });
    await require('./task-build').default();
  },

  async buildDev() {
    await this.config({ development: true });
    await require('./task-build').default();
  },

  async run(args = []) {
    await this.build();
    await require('./task-run').default(args);
  },

  async runDev(args = []) {
    const chokidar = require('chokidar');

    await this.buildDev();

    const { buildFile, appDir } = require('./task-build');
    const watcher = chokidar.watch(appDir, {
      ignoreInitial: true,
    });

    watcher.on('add', buildFile);
    watcher.on('change', buildFile);

    await require('./task-run').default(args);
    watcher.close();
  },

  async test(args = []) {
    await this.config({ development: false, test: true });
    await require('./task-test').default(args);
  },

  async quickTest(args = []) {
    await this.build();
    await this.config({ development: false, test: true, quickTest: true });
    await require('./task-test').default(args);
  },

  async clean() {
    await require('./task-clean-package').default();
  },

  async package() {
    await this.clean();
    await this.build();
    await this.config({ development: false, packaged: true });
    await require('./task-package').default();
  },
};
