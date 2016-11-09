// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import jsdom from 'jsdom';

import { collect } from '../../../utils/thunk-util';
import * as UIEffects from '../../../../app/ui/browser-modern/actions/ui-effects';
import * as EffectTypes from '../../../../app/ui/browser-modern/constants/effect-types';
import ActiveElement from '../../../../app/ui/browser-modern/model/active-element';

describe('ui actions', () => {
  it('should have a proper implementation for `setApplicationActiveElement`', () => {
    const owner = 'foo';
    const details = 'bar';
    expect(UIEffects.setApplicationActiveElement(owner, details)).toEqual({
      type: EffectTypes.SET_APPLICATION_ACTIVE_ELEMENT,
      owner,
      details,
    });
  });

  it('should have a proper implementation for `setChromeActiveElement`', () => {
    const details = 'bar';
    expect(UIEffects.setChromeActiveElement(details)).toEqual({
      type: EffectTypes.SET_APPLICATION_ACTIVE_ELEMENT,
      owner: ActiveElement.OWNER.CHROME,
      details,
    });
  });

  it('should have a proper implementation for `setContentActiveElement`', () => {
    const details = 'bar';
    expect(UIEffects.setContentActiveElement(details)).toEqual({
      type: EffectTypes.SET_APPLICATION_ACTIVE_ELEMENT,
      owner: ActiveElement.OWNER.CONTENT,
      details,
    });
  });

  it('should have a proper implementation for `focusURLBar`', () => {
    const pageId = 'foo';
    const options = { bar: 'baz' };

    const window = jsdom.jsdom(`
      <div id="browser-navbar-${pageId}">
        <div class="browser-location">
          <input>
        </div>
      </div>
    `).defaultView;

    global.document = window.document;

    expect(UIEffects.focusURLBar(pageId, options)).toEqual({
      type: EffectTypes.FOCUS_URL_BAR,
      urlbar: window.document.querySelector('input'),
      options,
    });

    delete global.document;
  });

  it('should have a proper implementation for `focusCurrentURLBar`', () => {
    const pageId = 'foo';
    const options = { bar: 'baz' };

    const window = jsdom.jsdom(`
      <div id="browser-navbar-${pageId}">
        <div class="browser-location">
          <input>
        </div>
      </div>
    `).defaultView;

    global.document = window.document;

    const state = {
      pages: {
        selectedId: pageId,
      },
    };

    expect(collect(UIEffects.focusCurrentURLBar(options), state)).toEqual([{
      type: EffectTypes.FOCUS_URL_BAR,
      urlbar: window.document.querySelector('input'),
      options,
    }]);

    delete global.document;
  });
});
