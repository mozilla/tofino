// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/**
 * Disable the eslint "strict" and "no-commonjs" rules, since this is a script
 * that runs in node without any babel support, so it's not not a module
 * implicitly running in strict mode, and we can't use the import syntax.
 */
/* eslint-disable strict */
/* eslint-disable import/no-commonjs */

'use strict';

require('babel-polyfill');
require('babel-register')();

const path = require('path');
const colors = require('colors/safe');
const webpack = require('webpack');

const Const = require('./const');
const { getBuildConfig } = require('../utils');
const { makeDevConfig, makeProdConfig } = require('../config/webpack.base');
const { logger } = require('../logging');

const WEBPACK_OUTPUT_CONFIG = {
  colors: true,
  hash: true,
  version: true,
  timings: true,
  assets: true,
  chunks: true,
  chunkModules: false,
  modules: true,
  children: true,
  cached: true,
  reasons: true,
  source: true,
  errorDetails: true,
  chunkOrigins: true,
};

let gSource;
let gWatcher;

process.on('message', e => {
  switch (e.message) {
    case 'build':
      onProcessBuildMessage(e.configPath, e.options);
      break;
    case 'will-close':
      onProcessWillCloseMessage();
      break;
    default:
      break;
  }
});

function onProcessBuildMessage(configPath, options) {
  let config = require(configPath).default; // eslint-disable-line

  const { development } = getBuildConfig();
  config = development ? makeDevConfig(config) : makeProdConfig(config);
  gSource = path.relative(Const.ROOT, path.dirname(config.entry));

  if (options.watch) {
    gWatcher = doWebpackWatchBuild(config);
  } else {
    doWebpackOneTimeBuild(config);
  }
}

function onProcessWillCloseMessage() {
  if (gWatcher) {
    stopWebpackWatch(gWatcher).then(onFinishedCleaningUp);
  } else {
    onFinishedCleaningUp();
  }
}

function onFinishedCleaningUp() {
  process.send({ message: 'cleaned-up' });
}

function doWebpackOneTimeBuild(config) {
  webpack(config).run((err, stats) => {
    if (err) {
      onFatalError(err);
      return;
    }
    if (stats.hasErrors()) {
      onBuildError(stats);
      return;
    }
    onInitialBuild(stats);
  });
}

function doWebpackWatchBuild(config, incremental = false) {
  return webpack(config).watch({}, (err, stats) => {
    if (err) {
      onFatalError(err);
      return;
    }
    if (stats.hasErrors()) {
      onBuildError(stats);
      return;
    }
    // Per webpack's documentation, this handler can be called multiple times,
    // e.g. when a build has been completed, or an error or warning has occurred.
    // It even can occur that handler is called for the same bundle multiple times.
    // So just keep that in mind.
    if (!incremental) {
      incremental = true;
      onInitialBuild(stats);
      logger.info('Now watching:', colors.green(gSource));
    } else {
      onIncrementalBuild(stats);
    }
  });
}

function stopWebpackWatch(watcher) {
  return new Promise(resolve => {
    watcher.close(() => {
      logger.info('Stopped watching:', colors.green(gSource));
      resolve();
    });
  });
}

function onFatalError(err) {
  process.send({ message: 'fatal-error', err });
}

function onBuildError(stats) {
  const output = stats.toString(WEBPACK_OUTPUT_CONFIG);
  const err = new Error('Compilation unsuccessful.');

  // Deferring to the parent process immediately would result in garbled text
  // if other logging operations follow. Furthermore, if the process exits,
  // it will stop the logging midway, resulting in incomplete output.
  logger.error(`\n${output}\n`);
  process.stderr.once('drain', () => process.send({ message: 'build-error', err }));
}

function onInitialBuild(stats) {
  const { time } = stats.toJson();
  logger.info('Build succeeded:', colors.green(gSource), colors.gray(`[${time} ms]`));
  process.send({ message: 'finished-build' });
}

function onIncrementalBuild(stats) {
  const { time } = stats.toJson();
  logger.info('Incremental build succeeded:', colors.green(gSource), colors.gray(`[${time} ms]`));
  process.send({ message: 'finished-incremental-build' });
}
