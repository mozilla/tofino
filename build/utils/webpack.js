// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import webpack from 'webpack';
import { logger } from '../logging';
import { dependencies } from '../../app/package.json';

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

export const nodeExternals = (context, request, cb) => {
  if (request.startsWith('.')) {
    cb(null, false);
    return;
  }

  for (const dependency of Object.keys(dependencies)) {
    if ((request === dependency) || request.startsWith(`${dependency}/`)) {
      cb(null, true);
      return;
    }
  }

  cb(null, false);
};

export const webpackBuild = config => new Promise((resolve, reject) => {
  let incremental = false;

  const watcher = webpack(config).watch({}, (err, stats) => {
    if (err) {
      // Failed with a fatal error.
      reject(err);
      return;
    }

    if (stats.hasErrors()) {
      // Failed with a build error.
      const output = stats.toString(WEBPACK_OUTPUT_CONFIG);
      // Rejecting immediately would result in garbled text if other
      // logging operations follow. Furthermore, if the process exits,
      // it will stop the logging midway, resulting in incomplete output.
      logger.error(`\n${output}\n`);
      process.stderr.once('drain', () => reject('Compilation unsuccessful.'));
      return;
    }

    /* eslint-disable no-shadow */
    resolve({
      close: () => new Promise(resolve => watcher.close(resolve)),
    });
    /* eslint-enable no-shadow */

    // Per webpack's documentation, this handler can be called multiple times,
    // e.g. when a build has been completed, or an error or warning has occurred.
    // It even can occur that handler is called for the same bundle multiple times.
    // So just keep that in mind.
    if (!incremental) {
      incremental = true;
      return;
    }

    const { time } = stats.toJson();
    logger.info(`Incremental build succeeded in ${time} ms.`);
  });
});
