// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

'use strict';

const exec = require('child_process').exec;
const path = require('path');

const manifest = require('../package.json');
const electronConfig = require('./electron-config');
const buildUtils = require('./utils');

module.exports = env => cb => {
  let command = `${buildUtils.getElectronPath()} ${path.join(__dirname, '..', manifest.main)}`;
  let environ = {};
  if (env === "production") {
    environ["NODE_ENV"] = 'production';
  }
  console.log(`Executing command: ${command}`);
  exec(command, { env: environ }, err => err ? cb(err) : cb()).stdout.pipe(process.stdout);
};
