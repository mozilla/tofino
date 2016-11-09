// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';

import { takeLatest } from 'redux-saga';
import { apply, put } from 'redux-saga/effects';
import main, * as ProfileSagas from '../../../../app/ui/browser-modern/sagas/profile-sagas';
import * as EffectTypes from '../../../../app/ui/browser-modern/constants/effect-types';
import * as UIActions from '../../../../app/ui/browser-modern/actions/ui-actions';
import userAgentHttpClient from '../../../../app/shared/user-agent-http-client';

describe('profile sagas', () => {
  it('should listen to the appropriate actions', () => {
    const gen = main();
    expect(gen.next().value.meta).toEqual({
      type: takeLatest,
      patterns: [
        [EffectTypes.FETCH_LOCATION_AUTOCOMPLETIONS, ProfileSagas.fetchCompletions],
        [EffectTypes.SET_REMOTE_BOOKMARK_STATE, ProfileSagas.setRemoteBookmarkState],
        [EffectTypes.ADD_REMOTE_HISTORY, ProfileSagas.addRemoteHistory],
        [EffectTypes.ADD_REMOTE_CAPTURED_PAGE, ProfileSagas.addRemoteCapturedPage],
      ],
    });
    expect(gen.next().done).toEqual(true);
  });

  it('should be able to fetch autocompletions when some query is supplied', () => {
    const payload = {
      pageId: 'foo',
      text: 'bar',
    };
    const initial = [
      { url: payload.text },
    ];
    const response = {
      results: [
        { url: 'baz' },
      ],
    };
    const gen = ProfileSagas.fetchCompletions(payload);
    expect(gen.next().value).toEqual(
      apply(userAgentHttpClient, userAgentHttpClient.query, [{ text: payload.text }]));
    expect(gen.next(response).value).toEqual(
      put(UIActions.setLocationAutocompletions(payload.pageId, [
        ...initial,
        ...response.results,
      ])));

    expect(gen.next().done).toEqual(true);
  });

  it('should be able to avoid fetching autocompletions when no query is supplied', () => {
    const payload = {
      pageId: 'foo',
      text: '',
    };
    const gen = ProfileSagas.fetchCompletions(payload);
    expect(gen.next().value).toEqual(
      put(UIActions.setLocationAutocompletions(payload.pageId, [])));

    expect(gen.next().done).toEqual(true);
  });
});
