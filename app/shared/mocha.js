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

/* eslint global-require: "off" */

export function runMochaTests(testdirs, globals = {}) {
  return new Promise((resolve, reject) => {
    const Mocha = require('mocha');

    require('babel-register')({
      only: /(test|build)\//,
    });

    const runner = new Mocha({
      ui: 'bdd',
      reporter: 'spec',
      timeout: 10000,
      ignoreLeaks: false,
      fullTrace: true,
    });

    for (const path of testdirs) {
      for (const file of Mocha.utils.lookupFiles(path, ['js'], true)) {
        runner.addFile(file);
      }
    }

    for (const name of Object.keys(globals)) {
      global[name] = globals[name];
    }

    runner.run(failures => {
      if (failures) {
        reject(failures);
      } else {
        resolve();
      }
    });
  });
}
