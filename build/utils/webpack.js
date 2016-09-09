// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/* eslint-disable no-shadow */

import path from 'path';
import childProcess from 'child_process';
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

export const webpackBuild = configPath => new Promise((resolve, reject) => {
  const child = childProcess.fork(path.join(__dirname, 'webpack-process'));

  child.on('message', e => {
    if (e.message === 'fatal-error' || e.message === 'build-error') {
      reject(e.err);
    }
  });

  const stopped = new Promise(resolve => {
    child.on('message', e => {
      if (e.message === 'stopped-watching') {
        child.kill();
        resolve();
      }
    });
  });

  const started = new Promise(resolve => {
    child.on('message', e => {
      if (e.message === 'started-watching') {
        resolve();
      }
    });
  });

  const start = () => {
    child.send({ message: 'start', configPath });
    return started;
  };

  const close = () => {
    child.send({ message: 'stop' });
    return stopped;
  };

  start().then(() => resolve({ close }));
});
