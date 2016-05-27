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
  build: args => require('./task-build').default(args),
  run: args => require('./task-run').default(args),
  test: args => require('./task-test').default(args),
  package: () => require('./task-package').default(),
  clean: () => require('./task-clean-package').default(),
};

export default {
  async buildDeps() {
    await Lazy.buildDeps();
  },

  async run(args = []) {
    await Lazy.config();
    await Lazy.build([...args, '--force']);
    await Lazy.run(args);
  },

  async runDev(args = []) {
    await Lazy.config({ development: true });
    await Lazy.build([...args, '--force']);

    const { buildFile, appDir } = require('./task-build');
    const watcher = chokidar.watch(appDir, {
      ignoreInitial: true,
    });

    watcher.on('add', (f, s) => buildFile(f, s, args));
    watcher.on('change', (f, s) => buildFile(f, s, args));

    await Lazy.run(args);
    watcher.close();
  },

  async test(args = []) {
    await Lazy.config({ test: true });
    await Lazy.build(args);
    await Lazy.test(args);
  },

  async package(args) {
    await Lazy.clean();
    await Lazy.config({ packaged: true });
    await Lazy.build([...args, '--force']);
    await Lazy.package();
  },
};
