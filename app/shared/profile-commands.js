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

import * as profileCommandTypes from './constants/profile-command-types';

import type { ReadabilityResult } from '../shared/types';
import { ipcRenderer } from './electron';

export type ProfileCommand = { type: string, payload: Object };

let tokenCounter = 0;

/**
 * Send a command to the User Agent service and do not expect a
 * response.
 *
 * Fire and forget.  Returns a Promise for convenience.
 */
export function send(command: ProfileCommand): Promise<any> {
  ipcRenderer.send('profile-command', { command });
  return Promise.resolve();
}

/**
 * Send a command to the User Agent service and expect a response.
 *
 * Returns a Promise that resolves to the response value.
 */
export function request(command: ProfileCommand): Promise<any> {
  const token = ++tokenCounter;
  return new Promise((resolve, reject) => {
    ipcRenderer.once(`profile-command-${token}`, (_event, response) => {
      if (response.error) {
        reject(response.payload);
        return;
      }
      resolve(response.payload);
    });
    ipcRenderer.send('profile-command', { token, command });
  });
}

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
