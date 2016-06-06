// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

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
  buildShared: () => require('./task-build-shared').default(),
  buildServices: () => require('./task-build-services').default(),
  buildMainProcess: () => require('./task-build-main-process').default(),
  buildBrowser: () => require('./task-build-browser').default(),
  buildContent: () => require('./task-build-content').default(),
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

  async build(config = {}, options = {}) {
    await Lazy.config(config);
    const watchers = [
      await Lazy.buildShared(),
      await Lazy.buildServices(),
      await Lazy.buildMainProcess(),
      await Lazy.buildBrowser(),
      await Lazy.buildContent(),
    ];
    if (!options.watch) {
      await Promise.all(watchers.map(w => w.close()));
      return [];
    }
    console.log('Now watching the filesystem for changes...');
    return watchers;
  },

  async serve() {
    await Lazy.config({ keepAliveAppServices: false });
    await Lazy.serve();
  },

  async run(args = []) {
    const watchers = await this.build({
      keepAliveAppServices: args.indexOf('services:keep-alive') !== -1,
    }, {
      watch: true,
    });
    await Lazy.run(args);
    await Promise.all(watchers.map(w => w.close()));
  },

  async runDev(args = []) {
    const watchers = await this.build({
      development: true,
      keepAliveAppServices: args.indexOf('services:keep-alive') !== -1,
    }, {
      watch: true,
    });
    await Lazy.run(args);
    await Promise.all(watchers.map(w => w.close()));
  },

  async test(args = []) {
    await this.build({ test: true });
    await Lazy.test(args);
  },

  async package() {
    // XXX: All builds (including packaged) currently start their own
    // UA and Contents services. In the future, we should consider
    // hosting these somewhere else other than the user's own machine.
    await this.build({ packaged: true });
    await Lazy.clean();
    await Lazy.package();
  },
};
