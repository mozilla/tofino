// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import path from 'path';
import * as BuildUtils from './utils';

export const BUILD_SYSTEM_DIR = __dirname;
export const SRC_DIR = path.join(BuildUtils.getRoot(), 'app');
export const BUILD_DIR = path.join(BuildUtils.getRoot(), 'lib');
export const PACKAGED_DIST_DIR = path.join(BuildUtils.getRoot(), 'dist');
