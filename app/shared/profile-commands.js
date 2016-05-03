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

import { ReadabilityResult } from '../shared/types';

export type ProfileCommand = { type: string, payload: Object };

/**
 * The command for the '✫' bookmark button.
 */
export function bookmark(url: string, title: ?string = undefined): ProfileCommand {
  return {
    type: profileCommandTypes.DID_BOOKMARK_LOCATION,
    payload: { url, title },
  };
}

/**
 * The command for undoing the '✫' bookmark button.
 */
export function unbookmark(url: string): ProfileCommand {
  return {
    type: profileCommandTypes.DID_UNBOOKMARK_LOCATION,
    payload: { url },
  };
}

export function visited(url: string, title: ?string = undefined): ProfileCommand {
  return {
    type: profileCommandTypes.DID_VISIT_LOCATION,
    payload: { url, title },
  };
}

export function setUserTypedLocation(text: string): ProfileCommand {
  return {
    type: profileCommandTypes.DID_SET_USER_TYPED_LOCATION,
    payload: {
      text,
    },
  };
}

export function closeBrowserWindow(): ProfileCommand {
  return {
    type: profileCommandTypes.DID_CLOSE_BROWSER_WINDOW,
    payload: {
    },
  };
}

export function newBrowserWindow(tabInfo: ?Object): ProfileCommand {
  return {
    type: profileCommandTypes.DID_OPEN_NEW_BROWSER_WINDOW,
    payload: {
      tabInfo,
    },
  };
}

export function savePage(page: ReadabilityResult): ProfileCommand {
  return {
    type: profileCommandTypes.DID_REQUEST_SAVE_PAGE,
    payload: page,
  };
}
