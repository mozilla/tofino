// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import webpack from 'webpack';
import path from 'path';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import defaultConfig from './webpack.base';
import * as Const from '../utils/const';
import { nodeExternals } from '../utils/webpack';

export const SRC_DIR = path.join(Const.SRC_DIR, 'main');
export const DST_DIR = path.join(Const.LIB_DIR, 'main');

export default {
  ...defaultConfig,
  entry: path.join(SRC_DIR, 'index.js'),
  output: {
    ...defaultConfig.output,
    path: DST_DIR,
    filename: 'index.js',
    sourceMapFilename: 'index.map',
    libraryTarget: 'commonjs',
  },
  target: 'electron',
  plugins: [
    ...defaultConfig.plugins,
    new webpack.DefinePlugin({
      __dirname: '__dirname',
    }),
    new webpack.DefinePlugin({
      PROCESS_TYPE: '"main"',
    }),
    new webpack.DefinePlugin({
      LIBDIR: 'require("path").join(__dirname, "..")',
    }),
    new CopyWebpackPlugin([{
      from: path.join(Const.SRC_DIR, 'node_modules'),
      to: path.join(Const.LIB_DIR, 'node_modules'),
    }]),
    new CopyWebpackPlugin([{
      from: path.join(Const.SRC_DIR, 'package.json'),
      to: path.join(Const.LIB_DIR, 'package.json'),
      toType: 'file',
    }]),
    new CopyWebpackPlugin([{
      from: path.join(Const.BUILD_CONFIG_PATH),
      to: path.join(Const.LIB_DIR, path.basename(Const.BUILD_CONFIG_PATH)),
      toType: 'file',
    }]),
    new CopyWebpackPlugin([{
      from: process.execPath,
      to: path.join(Const.LIB_DIR, path.basename(process.execPath)),
      toType: 'file',
    }]),
  ],
  externals: [
    ...defaultConfig.externals,
    nodeExternals,
  ],
};
