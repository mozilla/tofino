// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import jsdom from 'jsdom';

import { takeLatest } from 'redux-saga';
import { apply, put } from 'redux-saga/effects';
import main, * as UISagas from '../../../../app/ui/browser-modern/sagas/ui-sagas';
import * as EffectTypes from '../../../../app/ui/browser-modern/constants/effect-types';
import * as UIActions from '../../../../app/ui/browser-modern/actions/ui-actions';
import { ipcRenderer } from '../../../../app/shared/electron';
import { INTERACTION_TYPES } from '../../../../app/ui/shared/widgets/search';

describe('ui sagas', () => {
  it('should listen to the appropriate actions', () => {
    const gen = main();
    expect(gen.next().value.meta).toEqual({
      type: takeLatest,
      patterns: [
        [EffectTypes.SET_APPLICATION_ACTIVE_ELEMENT, UISagas.setActiveElement],
        [EffectTypes.FOCUS_URL_BAR, UISagas.focusURLBar],
        [EffectTypes.SET_URL_BAR_VALUE, UISagas.setURLBarValue],
        [EffectTypes.SHOW_DOWNLOAD_NOTIFICATION, UISagas.showDownloadNotification],
        [EffectTypes.CONFIRM_DEFAULT_BROWSER, UISagas.confirmDefaultBrowser],
      ],
    });
    expect(gen.next().done).toEqual(true);
  });

  it('should be able to set information about the active element', () => {
    const payload = {
      owner: 'foo',
      details: 'bar',
    };
    const gen = UISagas.setActiveElement(payload);
    expect(gen.next().value).toEqual(
      apply(ipcRenderer, ipcRenderer.send, ['guest-active-element', payload]));
    expect(gen.next().value).toEqual(
      put(UIActions.setActiveElement(payload.owner, payload.details)));

    expect(gen.next().done).toEqual(true);
  });

  it('should be able to set the urlbar value and default value', () => {
    const window = jsdom.jsdom().defaultView;
    const input = window.document.createElement('input');
    input.value = 'abc';
    input.dataset = {
      interaction: INTERACTION_TYPES.IDLE,
    };

    const payload = {
      urlbar: input,
      value: 'foo',
    };
    const gen = UISagas.setURLBarValue(payload);
    expect(gen.next().done).toEqual(true);
    expect(input.value).toEqual(payload.value);
    expect(input.defaultValue).toEqual(payload.value);
  });

  it('should be able to set only the urlbar default value when user is typing', () => {
    const window = jsdom.jsdom().defaultView;
    const input = window.document.createElement('input');
    input.value = 'abc';
    input.dataset = {
      interaction: INTERACTION_TYPES.USER_IS_TYPING,
    };

    const payload = {
      urlbar: input,
      value: 'foo',
    };
    const gen = UISagas.setURLBarValue(payload);
    expect(gen.next().done).toEqual(true);
    expect(input.value).toEqual('abc');
    expect(input.defaultValue).toEqual(payload.value);
  });

  it('should be able to set only the urlbar default value when user is focysing by mouse', () => {
    const window = jsdom.jsdom().defaultView;
    const input = window.document.createElement('input');
    input.value = 'abc';
    input.dataset = {
      interaction: INTERACTION_TYPES.FOCUSING_BY_MOUSE,
    };

    const payload = {
      urlbar: input,
      value: 'foo',
    };
    const gen = UISagas.setURLBarValue(payload);
    expect(gen.next().done).toEqual(true);
    expect(input.value).toEqual('abc');
    expect(input.defaultValue).toEqual(payload.value);
  });

  it('should be able to set only the urlbar default value when focused', () => {
    const window = jsdom.jsdom().defaultView;
    const input = window.document.createElement('input');
    input.value = 'abc';
    input.dataset = {
      focused: true,
    };

    const payload = {
      urlbar: input,
      value: 'foo',
    };
    const gen = UISagas.setURLBarValue(payload);
    expect(gen.next().done).toEqual(true);
    expect(input.value).toEqual('abc');
    expect(input.defaultValue).toEqual(payload.value);
  });

  it('should be able to reselect the urlbar when `keepSelection` is true', () => {
    const window = jsdom.jsdom().defaultView;
    const input = window.document.createElement('input');
    input.value = 'abc';
    input.dataset = {
      interaction: INTERACTION_TYPES.IDLE,
    };

    const payload = {
      urlbar: input,
      value: 'foo',
      info: {
        isActiveElement: true,
      },
      options: {
        keepSelection: true,
      },
    };

    input.selectionStart = 0;
    input.selectionEnd = input.value.length;

    const gen = UISagas.setURLBarValue(payload);
    expect(gen.next().value).toEqual(apply(input, input.select));
    expect(gen.next().done).toEqual(true);
    expect(input.value).toEqual(payload.value);
    expect(input.defaultValue).toEqual(payload.value);
  });

  it('should be able to avoid reselecting the urlbar when `keepSelection` is false', () => {
    const window = jsdom.jsdom().defaultView;
    const input = window.document.createElement('input');
    input.value = 'abc';
    input.dataset = {
      interaction: INTERACTION_TYPES.IDLE,
    };

    const payload = {
      urlbar: input,
      value: 'foo',
      info: {
        isActiveElement: true,
      },
      options: {
        keepSelection: false,
      },
    };

    input.selectionStart = 0;
    input.selectionEnd = input.value.length;

    const gen = UISagas.setURLBarValue(payload);
    expect(gen.next().done).toEqual(true);
    expect(input.value).toEqual(payload.value);
    expect(input.defaultValue).toEqual(payload.value);
  });
});
