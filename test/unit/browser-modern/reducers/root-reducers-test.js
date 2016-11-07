// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';

import reducer from '../../../../app/ui/browser-modern/reducers/root';
import pagesReducer from '../../../../app/ui/browser-modern/reducers/pages';
import * as pagesSelectors from '../../../../app/ui/browser-modern/selectors/pages';
import * as ActionTypes from '../../../../app/ui/browser-modern/constants/action-types';
import RootState from '../../../../app/ui/browser-modern/model/index';
import Pages from '../../../../app/ui/browser-modern/model/pages';

describe('root reducers', () => {
  let state;

  beforeEach(() => {
    state = undefined;
  });

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(undefined);
  });

  it('should handle OVERWRITE_APP_STATE', () => {
    const statusText = 'OVERWRITE_APP_STATE test';
    let newState = new RootState();
    // Make a change so we can be sure it uses the passed in state, not an unmodified
    // RootState.
    newState = newState.setIn(['ui', 'statusText'], statusText);

    const action = {
      type: ActionTypes.OVERWRITE_APP_STATE,
      state: newState,
    };
    expect(reducer(state, action)).toEqual(newState);
  });

  it('should handle OVERWRITE_APP_STATE with options.restoreHistory', () => {
    const location = 'https://mozilla.org';
    const history = [
      'https://github.com',
      'https://mozilla.org',
      'https://eff.org',
    ];

    const preparations = [{
      type: ActionTypes.CREATE_PAGE,
      id: '1',
      location,
    }, {
      type: ActionTypes.CREATE_PAGE,
      id: '2',
      location,
    }, {
      type: ActionTypes.SET_LOCAL_PAGE_HISTORY,
      pageId: '1',
      history,
      historyIndex: 1,
    }, {
      type: ActionTypes.SET_LOCAL_PAGE_HISTORY,
      pageId: '2',
      history,
      historyIndex: 2,
    }];

    const newState = (new RootState()).set('pages', preparations.reduce(pagesReducer, new Pages()));
    const action = {
      type: ActionTypes.OVERWRITE_APP_STATE,
      state: newState,
      options: {
        restoreHistory: true,
      },
    };

    state = reducer(state, action);
    expect(pagesSelectors.getPageById(state, '1').location).toEqual(
      `tofino://historyrestore/?history=${escape(JSON.stringify(history))}&historyIndex=1`
    );
    expect(pagesSelectors.getPageById(state, '2').location).toEqual(
      `tofino://historyrestore/?history=${escape(JSON.stringify(history))}&historyIndex=2`
    );
  });
});
