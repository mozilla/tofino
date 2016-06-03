// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import * as spawn from '../app/main/spawn';

export function startUserAgentService(options = {}) {
  spawn.startUserAgentService(null, options);
}

export function startContentService(options = {}) {
  spawn.startContentService(options);
}

export default function() {
  startUserAgentService({ attached: true });
  startContentService({ attached: true });
}
