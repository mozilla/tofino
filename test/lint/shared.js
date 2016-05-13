import glob from 'glob';
import fs from 'fs-promise';

// We can afford being a little more relaxed with the regexes here
// since we have very strict eslint rules about whitespace.
export const REQUIRES_REGEX = /require\('([\w-/]+)'\)/g;
export const IMPORTS_REGEX = /import(?:.*?from)?\s+'([\w-/]+)'/g;

export function globOne(wildcard) {
  return new Promise((resolve, reject) => {
    glob(wildcard, {}, (err, files) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(files);
    });
  });
}

export async function globMany(wildcards) {
  let out = [];
  for (const wildcard of wildcards) {
    const files = await globOne(wildcard);
    out = out.concat(files);
  }
  return out;
}

export async function regexSingleFile(path, regexps) {
  const contents = await fs.readFile(path, 'utf8');
  let out = [];

  for (const regex of regexps) {
    let match = regex.exec(contents);

    while (match) {
      const [, ...captures] = match;

      // In the case of submodule imports e.g. 'lodash/throttle', we're only
      // interested in the main module path component.
      const modules = captures.map(e => e.split('/')[0]);
      out = out.concat(modules);
      match = regex.exec(contents);
    }
  }
  return out;
}

export async function regexFiles(files, ...regexps) {
  let out = [];
  for (const file of files) {
    const matches = await regexSingleFile(file, regexps);
    out = out.concat(matches);
  }
  return Array.from(new Set(out));
}
