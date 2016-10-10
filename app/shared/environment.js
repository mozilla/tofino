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

import yargs from 'yargs';
import fs from 'fs-extra';
import AppDirectory from 'appdirectory';

import manifest from '../../package.json';
import BUILD_CONFIG from '../build-config.json';

// Electron sets a flag to let you know if the path to the app is included in
// the command line arguments.
const argv = process.argv.slice(process.defaultApp ? 2 : 1);

export const argParser = yargs.usage('Usage: $0 [options]').option('P', {
  alias: 'profile',
  default: undefined,
  describe: 'The user profile directory.',
  type: 'string',
});

/**
 * Note that it is important to not call this before all of the necessary
 * options have been added to the above argument parser. Normally you should
 * add options in the top level of modules that are imported at startup then
 * call this some time later.
 */
const parsedArgs = new Map();

export function parseArgs(args = argv) {
  let parsed = parsedArgs.get(args);
  if (parsed) {
    return parsed;
  }

  parsed = argParser.parse(args);

  // Only create the profile directory if we're parsing the
  // real command line arguments.
  if (args === argv) {
    if (parsed.profile === undefined) {
      const directories = new AppDirectory({
        appName: `${manifest.name}${BUILD_CONFIG.development ? '-dev' : ''}`,
        appAuthor: manifest.author.name,
      });
      parsed.profile = directories.userData();
    }

    fs.mkdirsSync(parsed.profile);
  }

  parsedArgs.set(args, parsed);
  return parsed;
}
