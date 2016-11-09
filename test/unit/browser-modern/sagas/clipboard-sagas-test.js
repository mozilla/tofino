// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';

import { takeLatest } from 'redux-saga';
import { apply } from 'redux-saga/effects';
import main, * as ClipboardSagas from '../../../../app/ui/browser-modern/sagas/clipboard-sagas';
import * as EffectTypes from '../../../../app/ui/browser-modern/constants/effect-types';
import { clipboard } from '../../../../app/shared/electron';

describe('clipboard sagas', () => {
  it('should listen to the appropriate actions', () => {
    const gen = main();
    expect(gen.next().value.meta).toEqual({
      type: takeLatest,
      patterns: [
        [EffectTypes.COPY_TEXT_TO_CLIPBOARD, ClipboardSagas.copyTextToClipboard],
      ],
    });
    expect(gen.next().done).toEqual(true);
  });

  it('should be able to write text to clipboard', () => {
    const payload = { text: 'foo' };
    const gen = ClipboardSagas.copyTextToClipboard(payload);
    expect(gen.next().value).toEqual(apply(clipboard, clipboard.writeText, [payload.text]));
    expect(gen.next().done).toEqual(true);
  });
});
