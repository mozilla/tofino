// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import { transformFile } from 'babel-core';
import fs from 'fs-promise';
import path from 'path';

export const appDir = path.resolve(path.join(__dirname, '..', 'app'));
export const libDir = path.resolve(path.join(__dirname, '..', 'lib'));
const getTargetPath = (sourcePath) => path.resolve(libDir, path.relative(appDir, sourcePath));

const transpile = (filename, options = {}) => new Promise((resolve, reject) => {
  transformFile(filename, options, (err, result) => {
    if (err) {
      reject(err);
    } else {
      resolve(result);
    }
  });
});

export async function buildFile(sourceFile, sourceStats) {
  let targetFile = getTargetPath(sourceFile);

  try {
    const targetStats = await fs.stat(targetFile);
    if (targetStats.mtime > sourceStats.mtime) {
      return;
    }
  } catch (e) {
    // The target may not exist. For whatever reason just go and try to build it
  }

  const extension = path.extname(sourceFile);
  if (extension === '.js' || extension === '.jsx') {
    const baseFile = targetFile.substring(0, targetFile.length - extension.length);
    targetFile = `${baseFile}.js`;
    const { code } = await transpile(sourceFile);
    await fs.writeFile(targetFile, code);
  } else {
    await fs.copy(sourceFile, targetFile);
  }
}

async function babelBuild() {
  const source = path.resolve(path.join(__dirname, '..', 'app'));

  const paths = await fs.walk(source);

  // Find all the directories and sort by depth.
  const dirs = paths.filter(p => p.stats.isDirectory())
                  .sort((a, b) => a.length - b.length);

  // Make sure they all exist in the target directory.
  await Promise.all(dirs.map(p => fs.ensureDir(getTargetPath(p.path))));

  // Build all the files
  const files = paths.filter(p => p.stats.isFile());
  await Promise.all(files.map(p => buildFile(p.path, p.stats)));
}

export default () => babelBuild();
