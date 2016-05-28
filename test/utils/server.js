// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import express from 'express';
import path from 'path';

const PORT = 8080;
const FIXTURES_PATH = path.join(__dirname, '..', 'fixtures');

/**
 * Exposes a function that starts up an Express static server
 * to the `./fixtures` directory on port 8080.
 * Returns a promise that resolves to an object containing
 * both `port` and `stop` function to stop the server.
 *
 * @return {Promise<{ port, stop }>}
 */
export default function start() {
  let server;
  function stop() {
    return new Promise((res, rej) => {
      server.close(err => {
        if (err) {
          rej(err);
        } else {
          res();
        }
      });
    });
  }

  return new Promise((resolve, reject) => {
    const app = express();
    app.use(express.static(FIXTURES_PATH));

    server = app.listen(PORT, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve({ port: PORT, stop });
      }
    });
  });
}
