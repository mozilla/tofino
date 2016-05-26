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

import path from 'path';
import * as userAgentService from './server';
import { ProfileStorage } from './storage';
import * as endpoints from '../../shared/constants/endpoints';

process.on('uncaughtException', console.error);
process.on('unhandledRejection', console.error);

ProfileStorage.open(path.join(__dirname, '..', '..')).then(async function (profileStorage) {
  await userAgentService.start(profileStorage,
                               endpoints.UA_SERVICE_PORT,
                               { debug: true, allowReuse: false });

  console.log(`Started a User Agent service running on ${endpoints.UA_SERVICE_PORT}.`);
});
