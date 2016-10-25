// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import path from 'path';

export const ROOT = path.resolve(path.dirname(path.join(__dirname, '..')));

export const BUILD_SYSTEM_DIR = path.join(ROOT, 'build');
export const SRC_DIR = path.join(ROOT, 'app');
export const LIB_DIR = path.join(ROOT, 'lib');
export const PROFILE_DIR = path.join(ROOT, 'profile');
export const PACKAGED_DIST_DIR = path.join(ROOT, 'dist');

export const APP_SHARED_DIR = path.join(SRC_DIR, 'shared');
export const BUILD_CONFIG_PATH = path.join(SRC_DIR, 'build-config.json');
export const BUILD_UTILS_PATH = path.join(BUILD_SYSTEM_DIR, 'utils');
export const BUILD_WEBPACK_CONFIGS_PATH = path.join(BUILD_SYSTEM_DIR, 'config');
export const BROWSER_FRONTENDS_PATH = path.join(BUILD_WEBPACK_CONFIGS_PATH, 'frontends.json');

export const CACHE_DIR = path.join(ROOT, '.cache');
export const ELECTRON_ROOT_DIR = path.join(ROOT, '.electron');
export const NODE_MODULES_DIR = path.join(ROOT, 'node_modules');
