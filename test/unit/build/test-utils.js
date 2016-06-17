// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import path from 'path';
import os from 'os';
import fs from 'fs';
import { autoFailingAsyncTest } from '../../utils/async';
import * as BuildUtils from '../../../build/utils';
import * as ElectronUtils from '../../../build/utils/electron';
import * as ProcessUtils from '../../../build/utils/process';

const cwd = fs.realpathSync(process.cwd());

describe('build utils', () => {
  it('should export `IS_TRAVIS` and `IS_APPVEYOR`', () => {
    expect(typeof BuildUtils.IS_TRAVIS).toEqual('boolean');
    expect(typeof BuildUtils.IS_APPVEYOR).toEqual('boolean');
  });

  it('should export `getElectronExecutable()`', () => {
    const executable = ElectronUtils.getElectronExecutable();
    expect(Object.keys(executable)).toEqual([
      'win32', 'darwin', 'linux',
    ]);
    expect(typeof executable.win32).toEqual('string');
    expect(typeof executable.darwin).toEqual('string');
    expect(typeof executable.linux).toEqual('string');
  });

  it('should export `getBuildConfig`', () => {
    const config = BuildUtils.getBuildConfig();
    expect(typeof config).toEqual('object');
    expect(typeof config.electron).toEqual('string');
    expect(typeof config.platform).toEqual('string');
    expect(typeof config.arch).toEqual('string');
    expect(typeof config.version).toEqual('string');
  });

  it('should export `writeBuildConfig`', () => {
    const initialConfig = BuildUtils.getBuildConfig();
    const bogusConfig = { foo: 'bar' };
    expect(initialConfig).toNotEqual(bogusConfig);

    BuildUtils.writeBuildConfig(bogusConfig);
    const loadedConfig = BuildUtils.getBuildConfig();
    expect(loadedConfig).toEqual(bogusConfig);

    BuildUtils.writeBuildConfig(initialConfig);
    const reloadedConfig = BuildUtils.getBuildConfig();
    expect(reloadedConfig).toEqual(initialConfig);
  });

  it('should export `getManifest`', () => {
    const manifest = BuildUtils.getManifest();
    expect(typeof manifest).toEqual('object');
    expect(typeof manifest.scripts).toEqual('object');
    expect(typeof manifest.dependencies).toEqual('object');
    expect(typeof manifest.devDependencies).toEqual('object');
  });

  it('should export `getElectronRoot`', () => {
    const root = ElectronUtils.getElectronRoot();
    expect(root).toEqual(path.join(cwd, '.electron'));
  });

  it('should export `getElectronPath`', () => {
    const root = ElectronUtils.getElectronRoot();
    const epath = ElectronUtils.getElectronPath();
    const executable = ElectronUtils.getElectronExecutable();
    expect(epath).toEqual(path.join(root, executable[os.platform()]));
  });

  it('should export `getElectronVersion`', () => {
    const version = ElectronUtils.getElectronVersion();
    expect(typeof version).toEqual('string');
  });

  it('should export `spawn`', autoFailingAsyncTest(async function() {
    try {
      await ProcessUtils.spawn('node', ['--version']);
    } catch (e) {
      expect(false).toBe(true);
    }
  }));
});
