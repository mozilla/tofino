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

import colors from 'colors/safe';
import fs from 'fs';
import path from 'path';
import { logger, pipeToStream } from '../../shared/logging';
import * as userAgentService from './server';
import { ProfileStorage } from './sqlstorage';
import meta from './meta.json';

process.on('uncaughtException', (err) => {
  logger.error(err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, p) => {
  logger.error(`Unhandled Rejection at: Promise ${JSON.stringify(p)}`);
  logger.error(reason.stack);
  process.exit(2);
});

export async function UserAgentService(options = {}) {
  if (typeof options.port !== 'number') {
    throw new Error('UserAgentService requires a `port` number.');
  }
  if (typeof options.db !== 'string') {
    throw new Error('UserAgentService requires a `db` string.');
  }
  if (!meta.validVersions.includes(options.version)) {
    throw new Error('UserAgentService requires a valid `version`.');
  }
  if (typeof options.contentServiceOrigin !== 'string') {
    throw new Error('UserAgentService requires a `contentServiceOrigin` string.');
  }

  const fileStream = fs.createWriteStream(path.join(options.db, 'ua-service.log'));
  logger.addStream(pipeToStream(fileStream, 'debug'));

  const port = options.port;
  const db = options.db;
  const version = options.version;
  const contentServiceOrigin = options.contentServiceOrigin;
  const profileStorage = await ProfileStorage.open(db);

  await userAgentService.start({
    storage: profileStorage,
    options: {
      debug: false,
      port,
      version,
      contentServiceOrigin,
    },
  });

  const msg = `Started a User Agent service running on ${port}`;
  logger.info(colors.green(msg));
}
