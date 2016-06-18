// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/**
 * Disable the eslint "import/default" rule, since `build/main.js` is a script
 * that runs in node without any babel support, so it's not not a module
 * implicitly running in strict mode, and we can't use the import syntax.
 */
/* eslint-disable import/default */

import expect from 'expect';
import { autoFailingAsyncTest, waitUntil } from '../../utils/async';
import main from '../../../build/main';

describe('build', () => {
  it('should parse arguments appropriately', autoFailingAsyncTest(async function() {
    const out = [];
    let caught = 0;

    const onTask = (...args) => out.push(args);
    const onError = () => ++caught;

    const tasks = createSpyTasks(onTask);
    const handlers = makeTestHandlers(tasks);
    const argv = makeTestArgs();

    await main(argv, tasks, handlers, onError);

    expect(out).toEqual([
      ['doFoo', ['--bar', '--baz']],
      ['doBaz', []],
    ]);

    waitUntil(() => caught === 1);
  }));
});

function makeTestArgs() {
  return ['ignored', '--foo', '--bar', '--baz'];
}

function makeTestTasks() {
  return {
    async doFoo() {
      return 1;
    },
    async doBar() {
      throw new Error('oops');
    },
    async doBaz() {
      return 3;
    },
    async doBogus() {
      return 4;
    },
  };
}

function makeTestHandlers(tasks) {
  return {
    '--foo': args => tasks.doFoo(args),
    '--baz': args => tasks.doBaz(args),
  };
}

function createSpyTasks(cb) {
  const tasks = makeTestTasks();
  const instrumented = {};

  const spy = async function(command, runner, ...args) {
    const retval = await runner(...args);
    cb(command, ...args);
    return retval;
  };

  for (const [command, runner] of Object.entries(tasks)) {
    instrumented[command] = spy.bind(instrumented, command, runner);
  }

  return instrumented;
}
