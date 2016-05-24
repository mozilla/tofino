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

export async function buildFile(sourceFile, sourceStats, args = []) {
  let targetFile = getTargetPath(sourceFile);
  const extension = path.extname(sourceFile);
  const baseFile = targetFile.substring(0, targetFile.length - extension.length);

  const isJS = extension === '.js' || extension === '.jsx';
  if (isJS) {
    targetFile = `${baseFile}.js`;
  }

  const force = args.indexOf('--force') > -1;
  if (!force) {
    try {
      const targetStats = await fs.stat(targetFile);
      if (targetStats.mtime > sourceStats.mtime) {
        return;
      }
    } catch (e) {
      // The target may not exist.
      // For whatever reason just go and try to build it.
    }
  }

  if (isJS) {
    const mapFile = `${baseFile}.map`;

    const results = await transpile(sourceFile, {
      sourceMaps: development,
      sourceFileName: fileUrl(sourceFile),
      presets: development ? [
        // No development-only presets yet.
      ] : [
        'react-optimize',
      ],
      plugins: development ? [
        // No development-only plugins yet.
      ] : [
        'transform-runtime',
      ],
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

export default async function babelBuild(args = []) {
  const source = path.resolve(path.join(__dirname, '..', 'app'));
  const paths = await fs.walk(source);

  // Find all the directories and sort by depth.
  const dirs = paths.filter(p => p.stats.isDirectory())
                    .sort((a, b) => a.length - b.length);

  // Make sure they all exist in the target directory.
  await Promise.all(dirs.map(p => fs.ensureDir(getTargetPath(p.path))));

  // Build all the files.
  const files = paths.filter(p => p.stats.isFile());
  await Promise.all(files.map(p => buildFile(p.path, p.stats, args)));
}
