// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import chokidar from 'chokidar';

/**
 * Use need to allow lazy loading of modules for all tasks. Generally,
 * we assume `build-config.js` exists, however *during* the build process
 * this might not be true, which will break certain native module imports that
 * try to eagerly load this file.
 */
 /* eslint global-require: 0 */

const Lazy = {
  buildDeps: () => require('./task-build-deps').default(),
  config: options => require('./task-config-builder').default(options),
  buildBrowser: args => require('./task-build-browser').default(args),
  buildContent: args => require('./task-build-content').default(args),
  run: args => require('./task-run').default(args),
  test: args => require('./task-test').default(args),
  serve: () => require('./task-serve').default(),
  package: () => require('./task-package').default(),
  clean: () => require('./task-clean-package').default(),
};

export default {
  async buildDeps() {
    await Lazy.buildDeps();
  },

  async build(args = [], config = {}) {
    await Lazy.config(config);
    await Lazy.buildBrowser();
    await Lazy.buildContent();
  },

  async serve() {
    await Lazy.serve();
  },

  async run(args = []) {
    await this.build([...args, '--force']);
    await Lazy.run(args);
  },

  async runDev(args = []) {
    await this.build([...args, '--force'], { development: true });

    const { buildFile, appDir } = require('./task-build-browser');
    const watcher = chokidar.watch(appDir, {
      ignoreInitial: true,
    });

    watcher.on('add', (f, s) => buildFile(f, s, args));
    watcher.on('change', (f, s) => buildFile(f, s, args));

    await Lazy.run(args);
    watcher.close();
  },

  async test(args = []) {
    await this.build(args, { test: true });
    await Lazy.test(args);
  },

  async package(args) {
    // XXX: All builds (including packaged) currently start their own
    // UA and Contents services. In the future, we should consider
    // hosting these somewhere else other than the user's own machine.
    await this.build([...args, '--force'], { packaged: true });
    await Lazy.clean();
    await Lazy.package();
  },
};
