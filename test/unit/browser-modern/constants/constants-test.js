// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';

import * as ActionTypes from '../../../../app/ui/browser-modern/constants/action-types';
import * as EffectTypes from '../../../../app/ui/browser-modern/constants/effect-types';

describe('constant', () => {
  it('action types should not have effect suffixes', () => {
    expect(Object.keys(ActionTypes).every(k => !k.endsWith('EFFECT'))).toEqual(true);
    expect(Object.values(ActionTypes).every(k => !k.endsWith('EFFECT'))).toEqual(true);
  });

  it('effect types should have proper suffixes', () => {
    expect(Object.keys(EffectTypes).every(k => !k.endsWith('EFFECT'))).toEqual(true);
    expect(Object.values(EffectTypes).every(k => k.endsWith('EFFECT'))).toEqual(true);
  });
});
