// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import fs from 'fs-promise';
import manifest from '../../package.json';
import { BUILD_CONFIG_PATH } from './const';

export const IS_TRAVIS = process.env.TRAVIS === 'true';
export const IS_APPVEYOR = process.env.APPVEYOR === 'True';

export function getManifest() {
  return manifest;
}

export function safeGetBuildConfig() {
  try { return getBuildConfig(); } catch (e) { return {}; }
}

export function getBuildConfig() {
  return fs.readJsonSync(BUILD_CONFIG_PATH);
}

export function writeBuildConfig(obj) {
  return fs.writeJsonSync(BUILD_CONFIG_PATH, obj, { spaces: 2 });
}
