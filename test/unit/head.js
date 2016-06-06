// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/* eslint-disable no-console */

// Make mocha tests fail if a prop type validation fails.
const error = console.error;
console.error = function(warning, ...args) {
  if (/(Invalid prop|Failed propType)/.test(warning)) {
    throw new Error(warning);
  }
  error.apply(console, [warning, ...args]);
};
