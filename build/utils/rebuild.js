// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import colors from 'colors/safe';
import fs from 'fs-promise';
import pick from 'lodash/pick';
import isEqual from 'lodash/isEqual';
import dirsum from 'dirsum';
import sha1 from 'sha1';
import { thenify } from 'thenify-all';

import * as Const from './const';
import { getBuildConfig, writeBuildConfig } from './';
import { logger } from '../logging';

export async function sourcesChanged(taskId, ...sources) {
  const results = [];

  for (const source of sources) {
    const { changed, sourceHash, sourceId } = await sourceChanged(taskId, source);
    if (changed) {
      results.push({ hash: sourceHash, id: sourceId });
    }
  }

  return results;
}

export async function sourceChanged(taskId, source) {
  logger.info(colors.gray('Checking if source changed', source));

  const sourceId = sha1(`${taskId} ${source}`);
  const sourceHash = (await thenify(dirsum.digest)(source, 'sha1')).hash;
  const currentConfig = getBuildConfig();

   // The `built` property contains hashes of the previously built sources.
   // These are used to prevent redundant rebuilds.

  if (!('built' in currentConfig)) {
    logger.info(colors.yellow(`No previous '${sourceId}' hash found.`));
    return { changed: true, sourceHash, sourceId };
  }
  if (!(sourceId in currentConfig.built)) {
    logger.info(colors.yellow(`No previous '${sourceId}' hash found.`));
    return { changed: true, sourceHash, sourceId };
  }
  if (currentConfig.built[sourceId] !== sourceHash) {
    logger.info(colors.yellow(`Source changed for '${sourceId}'.`));
    return { changed: true, sourceHash, sourceId };
  }

  return { changed: false, sourceHash, sourceId };
}

export function buildConfigChanged() {
  logger.info(colors.gray('Checking if build config changed', Const.BUILD_CONFIG_PATH));

  // Use `require` to import the base configuration file
  // to avoid a circular dependency.
  const baseConfig = require('./base-config').default; // eslint-disable-line
  const currentConfig = getBuildConfig();
  const sanitizedConfig = pick(currentConfig, Object.keys(baseConfig));
  const previousConfig = currentConfig.prev;

  if (!isEqual(sanitizedConfig, previousConfig)) {
    logger.info(colors.yellow('Build config changed.'));
    return true;
  }

  return false;
}

export async function buildDirectoryExists() {
  logger.info(colors.gray('Checking if build directory exists', Const.LIB_DIR));

  try {
    await fs.stat(Const.LIB_DIR);
    return true;
  } catch (e) {
    logger.info(colors.yellow('Build directory doesn\'t exist.'));
    return false;
  }
}

export async function shouldRebuild(taskId, ...sources) {
  // Check if the `lib` directory exists. If it doesn't, need to rebuild.
  if (!(await buildDirectoryExists())) {
    logger.info(colors.gray('Deleting hashes from the build config.'));
    const currentConfig = getBuildConfig();
    delete currentConfig.built;
    writeBuildConfig(currentConfig);
  }

  // Always also check for changes in the app/shared and build system as well.
  sources.push(Const.APP_SHARED_DIR);
  sources.push(Const.BUILD_SYSTEM_DIR);

  const changedSources = await sourcesChanged(taskId, ...sources);
  const currentConfig = getBuildConfig();

  for (const { hash, id } of changedSources) {
    currentConfig.built = currentConfig.built || {};
    currentConfig.built[id] = hash;
  }

  if (changedSources.length) {
    logger.info(colors.gray('Updating hashes in the build config.'));
    writeBuildConfig(currentConfig);
    return true;
  }

  // Even if the sources haven't changed, always rebuild if the
  // build configuration file has.
  if (buildConfigChanged()) {
    return true;
  }

  return false;
}
