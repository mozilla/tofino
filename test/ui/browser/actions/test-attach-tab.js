// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect'; // eslint-disable-line
import configureStore from '../../../../app/ui/browser/store/store';
import * as actions from '../../../../app/ui/browser/actions/main-actions'; // eslint-disable-line

describe('Action - ATTACH_TAB', () => {
  beforeEach(function() {
    this.store = configureStore();
    this.dispatch = this.store.dispatch;
  });

  it('Should attach tab');
});
