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
/* global PROCESS_TYPE */

import bunyan from 'bunyan';
import stream from 'stream';

const LEVELS = [
  'FATAL', 'ERROR', 'WARN', 'INFO', 'DEBUG', 'TRACE',
];

function getLevelName(level) {
  for (const name of LEVELS) {
    if (bunyan[name] === level) {
      return name;
    }
  }
  return null;
}

/**
 * Sends simple log messages to a given stream.
 */
export function pipeToStream(target, level = undefined) {
  if (level === undefined) {
    level = process.env.NODE_ENV !== 'production' ? 'debug' : 'warn';
  }

  const serializer = new stream.Transform({
    transform(chunk, encoding, next) {
      const message = JSON.parse(chunk);
      this.push(`${message.name} ${getLevelName(message.level)}: ${message.msg}\n`);
      next();
    },
  });
  serializer.pipe(target);

  return {
    stream: serializer,
    level,
    closeOnExit: true,
  };
}

/**
 * Sends log messages to the `console` object
 */
export function pipeToConsole() {
  /* eslint no-console: 0 */
  return {
    stream: new stream.Writable({
      write(chunk, encoding, next) {
        const message = JSON.parse(chunk);
        if (message.level >= bunyan.ERROR) {
          console.error(message.msg);
        } else if (message.level === bunyan.WARN) {
          console.warn(message.msg);
        } else if (message.level === bunyan.INFO) {
          console.info(message.msg);
        } else {
          console.log(message.msg);
        }

        next();
      },
    }),
    level: 'debug',
  };
}

let name = null;
try {
  name = PROCESS_TYPE;
} catch (e) {
  // This isn't being run in a webpack environment.
}

const streams = [];

switch (name) {
  case 'main':
  case 'ua-service':
  case 'content-service': {
    streams.push(pipeToStream(process.stdout));
    break;
  }
  case 'content':
  case 'ui': {
    streams.push(pipeToConsole());
    break;
  }
  default: {
    // If we're not webpacked we're probably in tests
    name = 'tests';
  }
}

export const logger = bunyan.createLogger({
  name,
  streams,
});
