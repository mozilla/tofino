// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import { transformFile } from 'babel-core';
import fs from 'fs-promise';
import path from 'path';

import { development } from '../build-config';

export const appDir = path.resolve(path.join(__dirname, '..', 'app'));
export const libDir = path.resolve(path.join(__dirname, '..', 'lib'));
const getTargetPath = (sourcePath) => path.resolve(libDir, path.relative(appDir, sourcePath));

function fileUrl(str) {
  let pathName = path.resolve(str).replace(/\\/g, '/');

  // Windows drive letter must be prefixed with a slash
  if (pathName[0] !== '/') {
    pathName = `/${pathName}`;
  }

  return encodeURI(`file://${pathName}`);
}

const transpile = (filename, options = {}) => new Promise((resolve, reject) => {
  transformFile(filename, options, (err, result) => {
    if (err) {
      reject(err);
    } else {
      resolve(result);
    }
  });
});

export async function buildFile(sourceFile, sourceStats, force = false) {
  let targetFile = getTargetPath(sourceFile);

  if (!force) {
    try {
      const targetStats = await fs.stat(targetFile);
      if (targetStats.mtime > sourceStats.mtime) {
        return;
      }
    } catch (e) {
      // The target may not exist. For whatever reason just go and try to build it
    }
  }

  const extension = path.extname(sourceFile);
  if (extension === '.js' || extension === '.jsx') {
    const baseFile = targetFile.substring(0, targetFile.length - extension.length);
    targetFile = `${baseFile}.js`;
    const mapFile = `${baseFile}.map`;
    const results = await transpile(sourceFile, {
      sourceMaps: development,
      sourceFileName: fileUrl(sourceFile),
    });

    if (development) {
      await fs.writeFile(mapFile, JSON.stringify(results.map));

      // This must be an absolute URL since the devtools can't resolve relative
      // paths from node modules.
      results.code += `\n//# sourceMappingURL=${fileUrl(mapFile)}\n`;
    }

    await fs.writeFile(targetFile, results.code);
  } else {
    await fs.copy(sourceFile, targetFile);
  }
}

async function babelBuild(args = []) {
  const index = args.indexOf('--force');
  const force = index > -1;
  args.splice(index, 1);

  let paths;
  if (!args.length) {
    const source = path.resolve(path.join(__dirname, '..', 'app'));
    paths = await fs.walk(source);
  } else {
    paths = args.map((p) => {
      const pathItem = path.resolve(path.join(__dirname, '..', p));
      return { path: pathItem, stats: fs.lstatSync(pathItem) };
    });
  }

  // Find all the directories and sort by depth.
  const dirs = paths.filter(p => p.stats.isDirectory())
                  .sort((a, b) => a.length - b.length);

  // Make sure they all exist in the target directory.
  await Promise.all(dirs.map(p => fs.ensureDir(getTargetPath(p.path))));

  // Build all the files
  const files = paths.filter(p => p.stats.isFile());
  await Promise.all(files.map(p => buildFile(p.path, p.stats, force)));
}

export default babelBuild;
