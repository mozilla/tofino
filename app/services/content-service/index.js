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

import * as contentService from '../content-service/server';
import * as endpoints from '../../shared/constants/endpoints';

process.on('uncaughtException', console.error);
process.on('unhandledRejection', console.error);

// Start the content service, serving `tofino://` pages.
// XXX: We're not actually registering a `tofino` http protocol just yet,
// due to a possible bug in electron. See https://github.com/electron/electron/issues/5714
// Currently we're just pointing the webview directly at the server address.
contentService.start().then(() => {
  console.log(`Started a new User Content service running on ${endpoints.CONTENT_SERVER_PORT}.`);
});
