// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import semver from 'semver';
import cd from 'check-dependencies';
import manifest from '../../package.json';
import { logger } from '../logging';

export const VALID_NODE_VERSION_RANGE = manifest.engines.node;

export function checkNodeVersion(version) {
  // Strip out the 'v' in version, since `process.version`
  // returns `v5.8.0`.
  version = version.replace(/v/g, '');

  if (semver.satisfies(version, VALID_NODE_VERSION_RANGE)) {
    return true;
  }

  /* eslint-disable quotes */
  logger.error(`\n` +
    `*****\n` +
    `You are currently running node ${process.version}.\nYour version of node ` +
    `must satisfy ${VALID_NODE_VERSION_RANGE}, or else strange things ` +
    `could happen.\nPlease upgrade your version of node, or use a ` +
    `node version manager, such as nvm:\nhttps://github.com/creationix/nvm\n` +
    `*****\n`);
  /* eslint-enable quotes */

  return false;
}

export function checkDependencies() {
  return new Promise((resolve, reject) => {
    cd(result => result.depsWereOk ? resolve() : reject(result));
  });
}
