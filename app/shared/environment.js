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
/* global LIBDIR */

import yargs from 'yargs/yargs';
import path from 'path';
import AppDirectory from 'appdirectory';
import fs from 'fs-extra';
import manifest from '../../package.json';
import BUILD_CONFIG from '../../build-config.json';

// Electron sets a flag to let you know if the path to the app is included in
// the command line arguments.
const argv = process.argv.slice(process.defaultApp ? 2 : 1);

export const argParser = yargs(argv).usage('Usage: $0 [options]').option('P', {
  alias: 'profile',
  default: undefined,
  describe: 'The user profile directory.',
  type: 'string',
});

let parsedArgs = undefined;

/**
 * Note that it is important to not call this before all of the necessary
 * options have been added to the above argument parser. Normally you should
 * add options in the top level of modules that are imported at startup then
 * call this some time later.
 */
export function parseArgs() {
  if (parsedArgs !== undefined) {
    return parsedArgs;
  }

  parsedArgs = argParser.argv;

  if (parsedArgs.profile === undefined) {
    if (!BUILD_CONFIG.development) {
      const directories = new AppDirectory({
        appName: manifest.name,
        appAuthor: manifest.author.name,
      });

      parsedArgs.profile = directories.userData();
    } else {
      parsedArgs.profile = path.join(LIBDIR, '..', 'profile');
    }
  }

  fs.mkdirsSync(parsedArgs.profile);

  return parsedArgs;
}
