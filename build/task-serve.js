// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import * as spawn from '../app/main/spawn';
import { getElectronPath } from './utils';

export function startUserAgentService(options = {}) {
  spawn.startUserAgentService(null, options);
}

export function startContentService(options = {}) {
  spawn.startContentService(options);
}

export default function() {
  startUserAgentService({ attached: true, command: getElectronPath() });
  startContentService({ attached: true, command: getElectronPath() });
}
