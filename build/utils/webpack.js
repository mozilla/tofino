// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/* eslint-disable no-shadow */

import path from 'path';
import childProcess from 'child_process';

import * as Const from '../utils/const';
import { dependencies } from '../../app/package.json';

export const nodeExternals = (context, request, cb) => {
  if (request.startsWith('.')) {
    cb(null, false);
    return;
  }

  for (const dependency of Object.keys(dependencies)) {
    if ((request === dependency) || request.startsWith(`${dependency}/`)) {
      cb(null, true);
      return;
    }
  }

  cb(null, false);
};

export const webpackBuild = (configPath, options) => new Promise((resolve, reject) => {
  const child = childProcess.fork(path.join(Const.BUILD_UTILS_PATH, 'webpack-process'));

  const once = expected => new Promise(resolve => {
    child.on('message', e => {
      if (e.message === expected) {
        resolve(e);
      }
    });
  });

  once('fatal-error', e => reject(e.err));
  once('build-error', e => reject(e.err));

  const build = () => {
    const finishedBuild = once('finished-build');
    child.send({ message: 'build', configPath, options });
    return finishedBuild;
  };

  const close = () => {
    const cleanedUp = once('cleaned-up');
    child.send({ message: 'will-close' });
    return cleanedUp.then(() => child.kill());
  };

  build().then(() => resolve({ close }));
});
