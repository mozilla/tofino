// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

import expect from 'expect';
import jsdom from 'jsdom';

import { takeEvery, takeLatest } from 'redux-saga';
import { apply, select, put, call } from 'redux-saga/effects';
import main, * as PageSagas from '../../../../app/ui/browser-modern/sagas/page-sagas';
import * as EffectTypes from '../../../../app/ui/browser-modern/constants/effect-types';
import * as PageActions from '../../../../app/ui/browser-modern/actions/page-actions';
import * as PageEffects from '../../../../app/ui/browser-modern/actions/page-effects';
import * as PageSelectors from '../../../../app/ui/browser-modern/selectors/pages';
import * as UIEffects from '../../../../app/ui/browser-modern/actions/ui-effects';
import * as URLUtil from '../../../../app/ui/shared/util/url-util';
import userAgentHttpClient from '../../../../app/shared/user-agent-http-client';

describe('page sagas', () => {
  it('should listen to the appropriate actions', () => {
    const gen = main();
    expect(gen.next().value.meta).toEqual({
      type: takeEvery,
      patterns: [
        [EffectTypes.CREATE_PAGE_SESSION, PageSagas.createPageSession],
        [EffectTypes.DESTROY_PAGE_SESSION, PageSagas.destroyPageSession],
        [EffectTypes.FORK_PAGE_BACK, PageSagas.forkPageBack],
        [EffectTypes.FORK_PAGE_FORWARD, PageSagas.forkPageForward],
        [EffectTypes.BULK_CREATE_STANDALONE_PAGE_SESSIONS,
          PageSagas.bulkCreateStandalonePageSessions],
        [EffectTypes.BULK_DESTROY_STANDALONE_PAGE_SESSIONS,
          PageSagas.bulkDestroyStandalonePageSessions],
        [EffectTypes.GET_CERTIFICATE_ERROR, PageSagas.getCertificateError],
      ],
    });
    expect(gen.next().value.meta).toEqual({
      type: takeLatest,
      patterns: [
        [EffectTypes.FOCUS_WEBVIEW, PageSagas.focusWebView],
        [EffectTypes.NAVIGATE_PAGE_TO, PageSagas.navigatePageTo],
        [EffectTypes.NAVIGATE_PAGE_BACK, PageSagas.navigatePageBack],
        [EffectTypes.NAVIGATE_PAGE_FORWARD, PageSagas.navigatePageForward],
        [EffectTypes.NAVIGATE_PAGE_REFRESH, PageSagas.navigatePageRefresh],
        [EffectTypes.NAVIGATE_PAGE_IN_HISTORY, PageSagas.navigatePageInHistory],
        [EffectTypes.TOGGLE_DEVTOOLS, PageSagas.toggleDevtools],
        [EffectTypes.PERFORM_DEVTOOLS_INSPECT_ELEMENT, PageSagas.performDevtoolsInspectElement],
        [EffectTypes.PERFORM_PAGE_DOWNLOAD, PageSagas.performPageDownload],
        [EffectTypes.PERFORM_PAGE_SEARCH, PageSagas.performPageSearch],
        [EffectTypes.SET_PAGE_ZOOM_LEVEL, PageSagas.setPageZoomLevel],
        [EffectTypes.CAPTURE_PAGE, PageSagas.capturePage],
        [EffectTypes.PARSE_PAGE_META_DATA, PageSagas.parsePageMetaData],
        [EffectTypes.DISPLAY_WEBVIEW_CONTEXT_MENU, PageSagas.displayWebviewContextMenu],
        [EffectTypes.PIN_TAB, PageSagas.pinTab],
        [EffectTypes.UNPIN_TAB, PageSagas.unpinTab],
        [EffectTypes.RESTORE_CLOSED_PAGE, PageSagas.restoreClosedPage],
      ],
    });
    expect(gen.next().done).toEqual(true);
  });

  it('should be able to create a page session without UI', () => {
    const payload = {
      id: 'foo',
      options: {
        withoutUI: true,
      },
    };
    const gen = PageSagas.createPageSession(payload);
    expect(gen.next().value).toEqual(
      apply(userAgentHttpClient, userAgentHttpClient.createSession, [payload.id]));

    expect(gen.next().done).toEqual(true);
  });

  it('should be able to create a page session with UI', () => {
    const payload = {
      id: 'foo',
      location: 'bar',
      options: {
      },
    };
    const gen = PageSagas.createPageSession(payload);
    expect(gen.next().value).toEqual(
      apply(userAgentHttpClient, userAgentHttpClient.createSession, [payload.id]));
    expect(gen.next().value).toEqual(
      put(PageActions.createPage(payload.id, payload.location, payload.options)));

    expect(gen.next().done).toEqual(true);
  });

  it('should be able to create a page session with UI and select the newly created urlbar', () => {
    const window = jsdom.jsdom().defaultView;
    global.document = window.document;

    const payload = {
      id: 'foo',
      location: 'bar',
      options: {
        selected: true,
      },
    };
    const gen = PageSagas.createPageSession(payload);
    expect(gen.next().value).toEqual(
      apply(userAgentHttpClient, userAgentHttpClient.createSession, [payload.id]));
    expect(gen.next().value).toEqual(
      put(PageActions.createPage(payload.id, payload.location, payload.options)));
    expect(gen.next().value).toEqual(
      put(UIEffects.focusURLBar(payload.id, { select: true })));

    expect(gen.next().done).toEqual(true);
    delete global.document;
  });

  it('should be able to destroy a page session without UI', () => {
    const payload = {
      id: 'foo',
      options: {
        withoutUI: true,
      },
    };
    const page = {
      id: 'bar',
    };
    const gen = PageSagas.destroyPageSession(payload);
    expect(gen.next().value).toEqual(
      select(PageSelectors.getPageById, payload.id));
    expect(gen.next(page).value).toEqual(
      apply(userAgentHttpClient, userAgentHttpClient.destroySession, [page]));

    expect(gen.next().done).toEqual(true);
  });

  it('should be able to destroy a page session with UI', () => {
    const payload = {
      id: 'foo',
      options: {
      },
    };
    const page = {
      id: 'bar',
    };
    const gen = PageSagas.destroyPageSession(payload);
    const currentPageCount = 2;
    expect(gen.next().value).toEqual(
      select(PageSelectors.getPageById, payload.id));
    expect(gen.next(page).value).toEqual(
      apply(userAgentHttpClient, userAgentHttpClient.destroySession, [page]));
    expect(gen.next().value).toEqual(
      select(PageSelectors.getPageCount));
    expect(gen.next(currentPageCount).value).toEqual(
      put(PageActions.removePage(page.id)));

    expect(gen.next().done).toEqual(true);
  });

  it('should be able to destroy a page session with UI and create a new one when there\'s no pages remaining', () => {
    const payload = {
      id: 'foo',
      options: {
        sessionIdUsedWhenCreatingNewPage: 'baz',
      },
    };
    const page = {
      id: 'bar',
    };
    const gen = PageSagas.destroyPageSession(payload);
    const currentPageCount = 1;
    expect(gen.next().value).toEqual(
      select(PageSelectors.getPageById, payload.id));
    expect(gen.next(page).value).toEqual(
      apply(userAgentHttpClient, userAgentHttpClient.destroySession, [page]));
    expect(gen.next().value).toEqual(
      select(PageSelectors.getPageCount));
    expect(gen.next(currentPageCount).value).toEqual(
      put(PageActions.removePage(page.id)));
    expect(gen.next(currentPageCount).value).toEqual(
      put(PageEffects.createPageSession({
        id: payload.options.sessionIdUsedWhenCreatingNewPage,
        selected: true,
      })));

    expect(gen.next().done).toEqual(true);
  });

  it('should be able to fork a page by an offset', () => {
    const id = 'foo';
    const history = [
      'http://a.com',
      'http://b.com',
      'http://c.com',
    ];

    const gen = PageSagas.forkPageByOffset(id, -1);
    gen.next();
    gen.next(true); // getPageCanGoBack
    gen.next(1); // getPageHistoryIndex
    gen.next(5); // getPageIndexById

    const createPageSessionCall = gen.next(history).value;
    const forkedId = createPageSessionCall.CALL.args[0].id;
    const forkedLocation = URLUtil.createHistoryRestoreUrl(history, 0);

    expect(createPageSessionCall).toEqual(
      call(PageSagas.createPageSession, PageEffects.createPageSession({
        location: forkedLocation,
        id: forkedId,
      }))
    );

    expect(gen.next().value).toEqual(
      put(PageActions.setPageIndex(forkedId, 6))
    );
    expect(gen.next().value).toEqual(
      put(PageActions.setSelectedPage(forkedId))
    );
    expect(gen.next().done).toEqual(true);
  });

  it('should focus a webview', () => {
    const window = jsdom.jsdom(`
      <div id="browser-page-foo">
        <div>
          <webview>
        </div>
      </div>
    `).defaultView;

    const webview = window.document.querySelector('webview');
    const gen = PageSagas.focusWebView({ webview });

    expect(gen.next().value).toEqual(apply(webview, webview.focus));
    expect(gen.next().done).toEqual(true);
  });
});
