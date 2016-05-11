// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import fs from 'fs-promise';

import { autoFailingAsyncTest } from '../utils/async.js';
import tasks from '../../build/tasks.js';
import * as utils from '../../build/utils.js';
import * as BuildConst from '../../build/const.js';

describe('build tasks', () => {
  it('should have a working `config` task', autoFailingAsyncTest(async function() {
    const initialConfig = utils.getBuildConfig();
    expect(initialConfig.foo).toNotExist();

    await tasks.config({ foo: 'bar' });

    const loadedConfig = utils.getBuildConfig();
    expect(loadedConfig.foo).toBe('bar');

    utils.writeBuildConfig(initialConfig);
    const reloadedConfig = utils.getBuildConfig();
    expect(reloadedConfig.foo).toNotExist();
  }));

  it('should have a working `clean` task', autoFailingAsyncTest(async function() {
    fs.ensureDir(BuildConst.DIST_DIR);

    let cleaned = false;
    await tasks.clean();
    try {
      await fs.stat(BuildConst.DIST_DIR);
    } catch (err) {
      cleaned = err;
    }
    expect(cleaned).toMatch(/no such file or directory/);
  }));
});
