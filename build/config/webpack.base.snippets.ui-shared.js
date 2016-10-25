// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import path from 'path';
import CopyWebpackPlugin from 'copy-webpack-plugin';

export const uiFiles = (srcDir, dstDir) => ([
  new CopyWebpackPlugin([{
    from: path.join(srcDir, '*.html'),
    to: dstDir,
    flatten: true,
  }]),
  new CopyWebpackPlugin([{
    from: path.join(srcDir, 'css', '*.css'),
    to: path.join(dstDir, 'css'),
    flatten: true,
  }]),
  new CopyWebpackPlugin([{
    from: path.join(srcDir, '*.ico'),
    to: path.join(dstDir),
    flatten: true,
  }]),
]);

export const sharedFiles = (sharedDir, dstDir) => ([
  new CopyWebpackPlugin([{
    from: path.join(sharedDir, 'css', '*.css'),
    to: path.join(dstDir, 'css'),
    flatten: true,
  }]),
  new CopyWebpackPlugin([{
    from: path.join(sharedDir, 'assets'),
    to: path.join(dstDir, 'assets'),
    flatten: true,
  }]),
  new CopyWebpackPlugin([{
    from: path.join(sharedDir, 'fonts'),
    to: path.join(dstDir, 'fonts'),
    flatten: true,
  }]),
]);
