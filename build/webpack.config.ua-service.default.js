// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import webpack from 'webpack';
import path from 'path';
import nodeExternals from 'webpack-node-externals';
import defaultConfig from './webpack.config.base';
import * as Const from './const';

export const SRC_DIR = path.join(Const.SRC_DIR, 'services', 'user-agent-service');
export const DST_DIR = path.join(Const.BUILD_DIR, 'services', 'user-agent-service');

export default {
  ...defaultConfig,
  entry: path.join(SRC_DIR, 'bin', 'user-agent-service'),
  output: {
    ...defaultConfig.output,
    path: DST_DIR,
    filename: 'user-agent-service',
    sourceMapFilename: 'user-agent-service.map',
  },
  target: 'node',
  plugins: [
    ...defaultConfig.plugins,
    new webpack.DefinePlugin({
      PROCESS_TYPE: '"ua-service"',
    }),
    new webpack.DefinePlugin({
      LIBDIR: 'require("path").join(__dirname, "..", "..")',
    }),
  ],
  externals: [
    ...defaultConfig.externals,
    nodeExternals(),
  ],
};
