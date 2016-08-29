// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import colors from 'colors/safe';
import { logger } from './logging';
import { safeGetBuildConfig } from './utils';
import argv from './utils/argv';

/**
 * Use need to allow lazy loading of modules for all tasks. Generally,
 * we assume `build-config.json` exists, however *during* the build process
 * this might not be true, which will break certain native module imports that
 * try to eagerly load this file.
 */
 /* eslint global-require: 0 */

const Lazy = {
  buildDeps: () => require('./task-build-deps').default(),
  config: options => require('./task-config-builder').overwriteConfig(options),
  saveConfig: options => require('./task-config-builder').saveConfigAsPrev(options),
  buildModules: () => require('./task-build-modules').default(),
  buildServices: () => require('./task-build-services').default(),
  buildMainProcess: () => require('./task-build-main-process').default(),
  buildPreload: () => require('./task-build-preload').default(),
  buildBrowser: () => require('./task-build-browser').default(),
  buildContent: () => require('./task-build-content').default(),
  run: args => require('./task-run').default(args),
  test: args => require('./task-test').default(args),
  serve: () => require('./task-serve').default(),
  package: () => require('./task-package').default(),
  clean: () => require('./task-clean-package').default(),
};

const unwatch = watchers => {
  logger.info(colors.gray('Stopped watching the filesystem for changes.'));
  return Promise.all(watchers.map(w => w.close()));
};

const Tasks = {
  async buildDeps() {
    await Lazy.buildDeps();
  },

  async build(config = {}, options = {}) {
    await Lazy.config(config);
    const watchers = [];
    try {
      watchers.push(await Lazy.buildModules());
      watchers.push(await Lazy.buildServices());
      watchers.push(await Lazy.buildMainProcess());
      watchers.push(await Lazy.buildBrowser());
      watchers.push(await Lazy.buildPreload());
      watchers.push(await Lazy.buildContent());
      logger.info(colors.green('Now watching the filesystem for changes...'));
    } catch (e) {
      await unwatch(watchers);
      throw e;
    }
    if (!options.watch) {
      await unwatch(watchers);
    }
    // Now that we've finished building, store the current configuration
    // so that we may diff in the future to avoid unnecessary builds.
    await Lazy.saveConfig();
    return watchers;
  },

  async serve() {
    await Lazy.config();
    const watchers = [
      await Lazy.buildServices(),
    ];
    await unwatch(watchers);
    // Now that we've finished building, store the current configuration
    // so that we may diff in the future to avoid unnecessary builds.
    await Lazy.saveConfig();
    await Lazy.serve();
  },

  async run(args = []) {
    const watchers = await this.build({}, { watch: true });
    await Lazy.run(args);
    await unwatch(watchers);
  },

  async runDev(args = []) {
    const watchers = await this.build({ development: true }, { watch: true });
    await Lazy.run(args);
    await unwatch(watchers);
  },

  async test(args = []) {
    // When testing locally, just use whatever build already existed,
    // regardless of whether it's production or development.
    const { development } = safeGetBuildConfig();
    logger.info(`Attempting to use existing ${development ? 'dev' : 'production'} build...`);
    await this.build({ development });
    await Lazy.test(args);
  },

  async testCI(args = []) {
    // These tests run on the CI server.
    logger.info('Making a production build...');
    await this.build();
    await Lazy.test(args);

    logger.info('Making a development build...');
    await this.build({ development: true });
    await Lazy.test(args);
  },

  async package() {
    // XXX: All builds (including packaged) currently start their own
    // UA and Contents services. In the future, we should consider
    // hosting these somewhere else other than the user's own machine.
    await this.build();
    await Lazy.clean();
    await Lazy.package();
  },
};

const CliMap = {
  '--build-deps': 'buildDeps',
  '--build-services': 'buildServices',
  '--serve': 'serve',
  '--build': 'build',
  '--run': 'run',
  '--run-dev': 'runDev',
  '--package': 'package',
  '--test': 'test',
  '--test-ci': 'testCI',
};

export async function run() {
  for (const [command, runner] of Object.entries(CliMap)) {
    if (argv[command.substr(2)]) {
      await Tasks[runner](argv._);
    }
  }
}
