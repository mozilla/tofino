// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import webpackProdConfig from './webpack.config.content.prod';
import webpackDevConfig from './webpack.config.content.dev';
import { webpackBuild, getBuildConfig } from './utils';

export default async function() {
  const { development } = getBuildConfig();
  await webpackBuild(development ? webpackDevConfig : webpackProdConfig);
}
