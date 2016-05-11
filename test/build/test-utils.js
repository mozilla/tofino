// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import path from 'path';
import os from 'os';
import { autoFailingAsyncTest } from '../utils/async.js';
import * as utils from '../../build/utils.js';

describe('build utils', () => {
  it('should export `IS_TRAVIS` and `IS_APPVEYOR`', () => {
    expect(typeof utils.IS_TRAVIS).toEqual('boolean');
    expect(typeof utils.IS_APPVEYOR).toEqual('boolean');
  });

  it('should export `getElectronExecutable()`', () => {
    const executable = utils.getElectronExecutable();
    expect(Object.keys(executable)).toEqual([
      'win32', 'darwin', 'linux',
    ]);
    expect(typeof executable.win32).toEqual('string');
    expect(typeof executable.darwin).toEqual('string');
    expect(typeof executable.linux).toEqual('string');
  });

  it('should export `getAppVersion`', () => {
    const version = utils.getAppVersion();
    expect(typeof version).toEqual('string');
  });

  it('should export `getRoot`', () => {
    const root = utils.getRoot();
    expect(root).toEqual(process.cwd());
  });

  it('should export `getBuildConfig`', () => {
    const config = utils.getBuildConfig();
    expect(typeof config).toEqual('object');
    expect(typeof config.electron).toEqual('string');
    expect(typeof config.platform).toEqual('string');
    expect(typeof config.arch).toEqual('string');
    expect(typeof config.version).toEqual('string');
  });

  it('should export `writeBuildConfig`', () => {
    const initialConfig = utils.getBuildConfig();
    const bogusConfig = { foo: 'bar' };
    expect(initialConfig).toNotEqual(bogusConfig);

    utils.writeBuildConfig(bogusConfig);
    const loadedConfig = utils.getBuildConfig();
    expect(loadedConfig).toEqual(bogusConfig);

    utils.writeBuildConfig(initialConfig);
    const reloadedConfig = utils.getBuildConfig();
    expect(reloadedConfig).toEqual(initialConfig);
  });

  it('should export `getManifest`', () => {
    const manifest = utils.getManifest();
    expect(typeof manifest).toEqual('object');
    expect(typeof manifest.scripts).toEqual('object');
    expect(typeof manifest.dependencies).toEqual('object');
    expect(typeof manifest.devDependencies).toEqual('object');
  });

  it('should export `getElectronRoot`', () => {
    const root = utils.getElectronRoot();
    expect(root).toEqual(path.join(process.cwd(), '.electron'));
  });

  it('should export `getElectronPath`', () => {
    const root = utils.getElectronRoot();
    const epath = utils.getElectronPath();
    const executable = utils.getElectronExecutable();
    expect(epath).toEqual(path.join(root, executable[os.platform()]));
  });

  it('should export `getElectronVersion`', () => {
    const version = utils.getElectronVersion();
    expect(typeof version).toEqual('string');
  });

  it('should export `spawn`', autoFailingAsyncTest(async function() {
    try {
      await utils.spawn('node', ['--version']);
    } catch (e) {
      expect(false).toBe(true);
    }
  }));
});
