export function autoFailingAsyncTest(runner) {
  return async function(done) {
    let caught;
    try {
      await runner();
    } catch (err) {
      caught = err;
    }
    done(caught);
  };
}

export function idleWait(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

export async function waitUntil(predicate, interval = 100, tries = 100) {
  for (let i = 0; i < tries; i++) {
    if (await predicate()) {
      return;
    }
    await idleWait(interval);
  }
  throw new Error(`Predicate returned false after ${tries} tries, aborting.\n`);
}
