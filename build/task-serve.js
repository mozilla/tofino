// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import * as spawn from '../app/main/spawn';
import { LIB_DIR, PROFILE_DIR } from './utils/const';

export function startUserAgentService(options = {}) {
  spawn.startUserAgentService(null, options);
}

export function startContentService(options = {}) {
  spawn.startContentService(options);
}

export default function() {
  startUserAgentService({ attached: true, libdir: LIB_DIR, profiledir: PROFILE_DIR });
  startContentService({ attached: true, libdir: LIB_DIR, profiledir: PROFILE_DIR });
}
