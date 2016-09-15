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

import fs from 'fs';
import path from 'path';
import colors from 'colors/safe';
import { logger, pipeToStream } from '../../shared/logging';
import * as contentService from './server';
import * as endpoints from '../../shared/constants/endpoints';
import { parseArgs } from '../../shared/environment';

process.on('uncaughtException', (err) => {
  logger.error(err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, p) => {
  logger.error(`Unhandled Rejection at: Promise ${JSON.stringify(p)}`);
  logger.error(reason.stack);
  process.exit(2);
});

const fileStream = fs.createWriteStream(path.join(parseArgs().profile, 'content-service.log'));
logger.addStream(pipeToStream(fileStream, 'debug'));

// Start the content service, serving `tofino://` pages.
contentService.start().then(() => {
  const msg = `Started a Content service running on ${endpoints.CONTENT_SERVER_PORT}.`;
  logger.info(colors.green(msg));
});
