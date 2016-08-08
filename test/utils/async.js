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
