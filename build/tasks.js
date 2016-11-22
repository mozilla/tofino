// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import { logger } from './logging';
import { safeGetBuildConfig } from './utils';
import { buildDirectoryExists, deleteBuildConfigHashes } from './utils/rebuild';
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
  buildContentService: options => require('./task-build-service-content').default(options),
  buildMainProcess: options => require('./task-build-main-process').default(options),
  buildPreload: options => require('./task-build-preload').default(options),
  buildBrowser: options => require('./task-build-browser').default(options),
  buildContent: options => require('./task-build-content').default(options),
  run: args => require('./task-run').default(args),
  test: args => require('./task-test').default(args),
  serve: () => require('./task-serve').default(),
  package: () => require('./task-package').default(),
  clean: () => require('./task-clean-package').default(),
};

const Tasks = {
  async buildDeps() {
    await Lazy.buildDeps();
  },

  async build(config = {}, options = {}) {
    await Lazy.config(config);

    // Check if the `lib` directory exists. If it doesn't, need to rebuild.
    if (!(await buildDirectoryExists())) {
      deleteBuildConfigHashes();
    }

    const builders = [];
    try {
      builders.push(await Lazy.buildModules());
      builders.push(await Lazy.buildContentService(options));
      builders.push(await Lazy.buildMainProcess(options));
      builders.push(await Lazy.buildBrowser(options));
      builders.push(await Lazy.buildPreload(options));
      builders.push(await Lazy.buildContent(options));
    } catch (e) {
      await Promise.all(builders.map(w => w.close()));
      throw e;
    }
    if (!options.watch) {
      await Promise.all(builders.map(w => w.close()));
    }
    // Now that we've finished building, store the current configuration
    // so that we may diff in the future to avoid unnecessary builds.
    await Lazy.saveConfig();
    return builders;
  },

  async serve() {
    // Make sure we'll run in development mode to enable logging.
    await Lazy.config({ development: true });

    // Check if the `lib` directory exists. If it doesn't, need to rebuild.
    if (!(await buildDirectoryExists())) {
      deleteBuildConfigHashes();
    }

    const builders = [
      await Lazy.buildModules(),
      await Lazy.buildContentService(),
    ];
    await Promise.all(builders.map(w => w.close()));

    // Now that we've finished building, store the current configuration
    // so that we may diff in the future to avoid unnecessary builds.
    await Lazy.saveConfig();
    await Lazy.serve();
  },

  async run(args = []) {
    const builders = await this.build({}, { watch: true });
    await Lazy.run(args);
    await Promise.all(builders.map(w => w.close()));
  },

  async runDev(args = []) {
    const builders = await this.build({ development: true }, { watch: true });
    await Lazy.run(args);
    await Promise.all(builders.map(w => w.close()));
  },

  async test(args = []) {
    // When testing locally, just use whatever build already existed,
    // regardless of whether it's production or development.
    const { development, offerDefault } = safeGetBuildConfig();
    logger.info(`Attempting to use existing ${development ? 'dev' : 'production'} build...`);
    await this.build({ development, offerDefault });
    await Lazy.test(args);
  },

  async testCI(args = []) {
    // These tests run on the CI server.
    logger.info('Making a development build...');
    await this.build({ development: true, offerDefault: false });
    await Lazy.test(args);

    logger.info('Making a production build...');
    await this.build({ offerDefault: false });
    await Lazy.test(args);
  },

  async package() {
    // XXX: All builds (including packaged) currently start their own
    // Content service. In the future, we should consider hosting
    // these somewhere else other than the user's own machine.
    await this.build({ packaged: true, offerDefault: true });
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
