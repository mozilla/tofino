// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import fs from 'fs-promise';
import omit from 'lodash/omit';

import { autoFailingAsyncTest } from '../../utils/async.js';
import { overwriteConfig } from '../../../build/task-config-builder.js';
import clean from '../../../build/task-clean-package.js';
import baseConfig from '../../../build/base-config';
import * as BuildUtils from '../../../build/utils';
import * as Const from '../../../build/utils/const';

describe('build tasks', () => {
  // Tests might be running on both production and development builds, so
  // there's no guarantee as to what `development` flag is set in the config.
  const baseConfigToCheckAgainst = omit(baseConfig, 'development');

  it('should have a proper `build-config.json` while testing', () => {
    expect(BuildUtils.getBuildConfig()).toContain(baseConfigToCheckAgainst);
  });

  it('should have a working `config` task', autoFailingAsyncTest(async function() {
    const initialConfig = BuildUtils.getBuildConfig();
    expect(initialConfig.foo).toNotExist();

    await overwriteConfig({ foo: 'bar' });

    const loadedConfig = BuildUtils.getBuildConfig();
    expect(loadedConfig.foo).toBe('bar');
    expect(loadedConfig).toContain(baseConfigToCheckAgainst);

    BuildUtils.writeBuildConfig(initialConfig);
    const reloadedConfig = BuildUtils.getBuildConfig();
    expect(reloadedConfig.foo).toNotExist();
    expect(reloadedConfig).toContain(baseConfigToCheckAgainst);
  }));

  it('should have a working `clean` task', autoFailingAsyncTest(async function() {
    fs.ensureDir(Const.PACKAGED_DIST_DIR);

    let cleaned = false;
    await clean();
    try {
      await fs.stat(Const.PACKAGED_DIST_DIR);
    } catch (err) {
      cleaned = err;
    }
    expect(cleaned).toMatch(/no such file or directory/);
  }));
});
