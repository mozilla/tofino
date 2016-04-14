// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import webpack from 'webpack';

import webpackProdConfig from './webpack.config.prod';
import webpackDevConfig from './webpack.config.dev';
import { development } from '../build-config';

export default () => new Promise((resolve, reject) => {
  const config = development ? webpackDevConfig : webpackProdConfig;
  const compiler = webpack(config);
  compiler.run(resolve, err => {
    if (err) {
      reject(err);
    }
    resolve();
  });
});
