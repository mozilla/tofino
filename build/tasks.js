// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/* eslint global-require: 0 */

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

  async buildDeps() {
    await require('./task-build-deps').default();
  },

  async build(args = [], config = {}) {
    await this.config(config);
    await require('./task-build').default(args);
  },

  async buildDev(args = []) {
    await this.config({ development: true });
    await require('./task-build').default(args);
  },

  async run(args = []) {
    await this.build(args);
    await require('./task-run').default(args);
  },

  async runDev(args = []) {
    const chokidar = require('chokidar');

    await this.buildDev(args);

    const { buildFile, appDir } = require('./task-build');
    const watcher = chokidar.watch(appDir, {
      ignoreInitial: true,
    });

    watcher.on('add', (f, s) => buildFile(f, s, args));
    watcher.on('change', (f, s) => buildFile(f, s, args));

    await require('./task-run').default(args);
    watcher.close();
  },

  async test(args = []) {
    await this.build(args, { development: false, test: true });
    await require('./task-test').default(args);
  },

  async lintOnlyTest(args = []) {
    await this.build(args, { development: false, test: true });
    await require('./task-test').default([...args, 'test/lint']);
  },

  async clean() {
    await require('./task-clean-package').default();
  },

  async package(args) {
    await this.clean();
    await this.build(args);
    await this.config({ development: false, packaged: true });
    await require('./task-package').default();
  },
};
