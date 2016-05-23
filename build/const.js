import path from 'path';
import * as BuildUtils from './utils';

export const DIST_DIR = path.join(BuildUtils.getRoot(), 'dist');
export const NODE_MODULES_DIR = path.join(BuildUtils.getRoot(), 'node_modules');
export const BUILD_CONFIG_FILE = path.join(BuildUtils.getRoot(), 'build-config.json');
export const ELECTRON_DIR = path.join(BuildUtils.getRoot(), '.electron');
