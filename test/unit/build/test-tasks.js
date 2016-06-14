// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import fs from 'fs-promise';

import { autoFailingAsyncTest } from '../../utils/async.js';
import BASE_CONFIG from '../../../build/base-config.js';
import { overwriteConfig } from '../../../build/task-config-builder.js';
import clean from '../../../build/task-clean-package.js';
import * as utils from '../../../build/utils.js';
import * as BuildConst from '../../../build/const.js';

const currentExpectedConfig = Object.assign({}, BASE_CONFIG, {
  test: true,
});

describe('build tasks', () => {
  it('should have a proper `build-config.json` while testing', () => {
    expect(utils.getBuildConfig()).toContain(currentExpectedConfig);
  });

  it('should have a working `config` task', autoFailingAsyncTest(async function() {
    const initialConfig = utils.getBuildConfig();
    expect(initialConfig.foo).toNotExist();

    await overwriteConfig({ foo: 'bar' });

    const loadedConfig = utils.getBuildConfig();
    expect(loadedConfig.foo).toBe('bar');
    expect(loadedConfig).toContain(BASE_CONFIG);

    utils.writeBuildConfig(initialConfig);
    const reloadedConfig = utils.getBuildConfig();
    expect(reloadedConfig.foo).toNotExist();
    expect(reloadedConfig).toContain(currentExpectedConfig);
  }));

  it('should have a working `clean` task', autoFailingAsyncTest(async function() {
    fs.ensureDir(BuildConst.PACKAGED_DIST_DIR);

    let cleaned = false;
    await clean();
    try {
      await fs.stat(BuildConst.PACKAGED_DIST_DIR);
    } catch (err) {
      cleaned = err;
    }
    expect(cleaned).toMatch(/no such file or directory/);
  }));
});
