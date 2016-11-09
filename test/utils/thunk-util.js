// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

export function collect(thunk, state) {
  const actions = [];
  thunk(action => actions.push(action), () => state);
  return actions;
}
