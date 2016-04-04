import { development } from '../build-config';

/**
 * When you want to create a new object containing mutated keys/values compared
 * to another object.
 * A shallow clone of an object could be achieved like this:
 *     const clone = mapObject(orig, ([key, value]) => [key, value]);
 * @param source object to be used as a reference
 * @param mapper function that is passed each of the entries
 * (i.e. [key, value]) in the source object, and is expected to return
 * similar mutated entries
 */
export function mapObject(source, mapper) {
  const keys = Object.keys(source);
  const entries = keys.map(key => [key, source[key]]);
  const newEntries = entries.map(mapper);

  const dest = {};
  newEntries.forEach(([newKey, newValue]) => { dest[newKey] = newValue; });
  return dest;
}

/**
 * A generator to iterate over the properties of the 'thing' object where each
 * property yields `[key, value, index]`
 */
export function * objectEntries(thing) {
  if (thing != null) {
    const keys = Object.keys(thing);
    for (let i = 0; i < keys.length; i++) {
      yield [keys[i], thing[keys[i]], i];
    }
  }
}

/**
 * Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * N milliseconds.
 */
export function debounce(func, wait) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      timeout = null;
      func(...args);
    }, wait);
  };
}

/**
 * Whether or not hot reloading and minified files should be used
 */
export function isProduction() {
  return !development;
}
