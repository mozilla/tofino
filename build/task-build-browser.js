// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import webpackProdConfig from './webpack.config.browser.prod';
import webpackDevConfig from './webpack.config.browser.dev';
import { webpackBuild, getBuildConfig } from './utils';

export default async function() {
  console.log('Building browser...');
  const { development } = getBuildConfig();
  return await webpackBuild(development ? webpackDevConfig : webpackProdConfig);
}
