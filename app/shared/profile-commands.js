/* @flow */

/*
 Copyright 2016 Mozilla

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use
 this file except in compliance with the License. You may obtain a copy of the
 License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed
 under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 CONDITIONS OF ANY KIND, either express or implied. See the License for the
 specific language governing permissions and limitations under the License.
 */

import * as requestModule from 'request';

import * as profileCommandTypes from './constants/profile-command-types';

import type { ReadabilityResult } from '../shared/types';

export type ProfileCommand = { type: string, payload: Object };

requestModule.debug = true;
const request = requestModule.defaults({
  baseUrl: 'http://localhost:9090',
  json: true,
});
export { request };

/**
 * The command for the '✫' bookmark button.
 */
export function bookmark(sessionId: number, url: string,
                         title: ?string = undefined): ProfileCommand {
  return {
    type: profileCommandTypes.DID_BOOKMARK_LOCATION,
    payload: {
      sessionId,
      url,
      title,
    },
  };
}

/**
 * The command for undoing the '✫' bookmark button.
 */
export function unbookmark(sessionId: number, url: string): ProfileCommand {
  return {
    type: profileCommandTypes.DID_UNBOOKMARK_LOCATION,
    payload: {
      sessionId,
      url,
    },
  };
}

export function visited(sessionId: number, url: string,
                        title: ?string = undefined): ProfileCommand {
  return {
    type: profileCommandTypes.DID_VISIT_LOCATION,
    payload: {
      sessionId,
      url,
      title,
    },
  };
}

export function setUserTypedLocation(text: string, sessionId: ?number = undefined): ProfileCommand {
  return {
    type: profileCommandTypes.DID_SET_USER_TYPED_LOCATION,
    payload: {
      sessionId,
      text,
    },
  };
}

export function startSession(ancestorId: ?number, reason: ?string): ProfileCommand {
  return {
    type: profileCommandTypes.DID_START_SESSION,
    payload: {
      ancestorId,
      reason,
    },
  };
}

export function endSession(sessionId: number, reason: ?string): ProfileCommand {
  return {
    type: profileCommandTypes.DID_END_SESSION,
    payload: {
      sessionId,
      reason,
    },
  };
}

export function savePage(sessionId: number, page: ReadabilityResult): ProfileCommand {
  return {
    type: profileCommandTypes.DID_REQUEST_SAVE_PAGE,
    payload: {
      sessionId,
      page,
    },
  };
}
