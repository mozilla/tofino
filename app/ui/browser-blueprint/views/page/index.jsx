/*
Copyright 2016 Mozilla

Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed
under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
CONDITIONS OF ANY KIND, either express or implied. See the License for the
specific language governing permissions and limitations under the License.
*/

import React, { PropTypes, Component } from 'react';
import { logger } from '../../../../shared/logging';

import Style from '../../../shared/style';
import * as UIConstants from '../../constants/ui';
import Status from '../window/status';
import Search from '../../../shared/widgets/search';
import ErrorPage from './error-page';
import { getCertificateError } from '../../lib/cert';
import { PageState } from '../../model';
import { fixURL } from '../../browser-util';
import { menuWebViewContext, inPageSearch } from '../../actions/external';
import * as actions from '../../actions/main-actions';
import * as userAgent from '../../lib/user-agent';

const PAGE_STYLE = Style.registerStyle({
  // Mark this as the relative anchor for floating children (e.g. search bar).
  position: 'absolute',
  top: 0,
  bottom: 0,
  right: 0,
  left: 0,
  backgroundColor: 'white',

  // Simply hiding webviews isn't recommended (see the discussion at:
  // https://github.com/electron/electron/blob/master/docs/api/web-view-tag.md#css-styling-notes)
  // Instead just layer the active page over the top of the others.
  '&.active-browser-page': {
    zIndex: UIConstants.BROWSER_CONTENT_ACTIVE_PAGE_ZINDEX,
  },
});

const SEARCH_STYLE = Style.registerStyle({
  zIndex: UIConstants.CONTENT_SEARCHBOX_ZINDEX,
  position: 'absolute',
  top: '10px',
  right: '10px',
  width: '300px',
});

const WEB_VIEW_STYLE = Style.registerStyle({
  display: 'flex',
  flex: 1,
});

class Page extends Component {
  componentDidMount() {
    const { webViewController, page, dispatch } = this.props;
    const { id } = page;
    const webview = this.webview;

    addListenersToWebView(webview, () => this.props.page, dispatch);

    webViewController.on(`navigate-back:${id}`, () => webview.goBack());
    webViewController.on(`navigate-forward:${id}`, () => webview.goForward());
    webViewController.on(`navigate-refresh:${id}`, () => webview.reload());
    webViewController.on(`navigate-to:${id}`,
      (_, loc) => webview.setAttribute('src', fixURL(loc)));

    webViewController.on(`toggle-devtools:${id}`, () => {
      if (!webview.isDevToolsOpened()) {
        // Per-WebView devtools are always detached, regardless of 'detached' and 'mode' options.
        webview.openDevTools();
      } else {
        webview.closeDevTools();
      }
    });

    webViewController.on(`capture-page:${id}`, () => {
      const script = 'window._readerify(window.document)';
      webview.executeJavaScript(script, false, readerResult => {
        if (!readerResult) {
          return;
        }

        userAgent.createPage(this.props.page, {
          url: readerResult.uri,
          readerResult,
        });
      });
    });

    if (!page.guestInstanceId && page.location) {
      webview.setAttribute('src', fixURL(page.location));
    }
  }

  render() {
    const requestContextData = (event) => {
      const { offsetX: x, offsetY: y } = event.nativeEvent;
      this.webview.send('get-contextmenu-data', { x, y });
    };

    const showPageError = this.props.page.state.state === PageState.STATES.FAILED;

    return (
      <div className={`page ${PAGE_STYLE} ${this.props.isActive ? 'active-browser-page' : ''}`}
        data-page-state={this.props.page.state.state}>
        <Search id="browser-page-search"
          className={SEARCH_STYLE}
          hidden={!this.props.page.isSearching}
          onKeyUp={inPageSearch} />
        <ErrorPage
          hidden={!showPageError}
          {...this.props.page.state} />
        <webview is="webview"
          ref={w => this.webview = w}
          class={`webview-${this.props.page.id} ${WEB_VIEW_STYLE}`}
          preload="../preload/index.js"
          guestInstanceId={this.props.page.guestInstanceId}
          onContextMenu={requestContextData} />
        <Status page={this.props.page} />
      </div>
    );
  }
}

Page.displayName = 'Page';

Page.propTypes = {
  page: PropTypes.object.isRequired,
  isActive: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
  webViewController: PropTypes.object.isRequired,
};

export default Page;

function addListenersToWebView(webview, pageAccessor, dispatch) {
  // 'new-window' is fired when a navigation request that should happen in a new frame is made. See
  // https://github.com/electron/electron/blob/master/docs/api/web-contents.md#event-new-window
  webview.addEventListener('new-window', (e) => {
    // TODO: differentiate more thoroughly based on e.disposition.
    const selected = e.disposition && e.disposition === 'foreground-tab';
    dispatch(actions.createTab(e.url, pageAccessor().sessionId, { selected }));
  });

  webview.addEventListener('did-start-loading', () => {
    dispatch(actions.setPageState(pageAccessor().id, {
      state: PageState.STATES.LOADING,
    }));
  });

  webview.addEventListener('dom-ready', () => {
    dispatch(actions.setPageDetails(pageAccessor().id, {
      canGoBack: webview.canGoBack(),
      canGoForward: webview.canGoForward(),
      canRefresh: true,
    }));
  });

  webview.addEventListener('page-title-set', e => {
    dispatch(actions.setPageDetails(pageAccessor().id, {
      title: e.title,
      location: webview.getURL(),
    }));
  });

  webview.addEventListener('did-fail-load', async function(e) {
    const { errorCode, errorDescription, validatedURL, isMainFrame } = e;

    if (!isMainFrame) {
      return;
    }

    // If a page is aborted (like hitting BACK/RELOAD while a page is loading), we'll get a
    // load failure of ERR_ABORTED with code `-3` -- this is intended, so just ignore it.
    if (Math.abs(errorCode) === 3) {
      return;
    }

    const state = {
      state: PageState.STATES.FAILED,
      code: errorCode,
      description: errorDescription,
      url: validatedURL,
    };

    // Most cert errors are 501 from this event; the true, more descriptive
    // error description can be retrieved from the main process. Just check
    // here roughly if the error looks like a cert error.
    if (Math.abs(errorCode) === 501 || /CERT/.test(errorDescription)) {
      const { error, certificate } = await getCertificateError(validatedURL);
      state.certificate = certificate;
      state.description = error;
    }

    dispatch(actions.setPageState(pageAccessor().id, state));
  });

  // The `did-stop-loading` event fires even when a failure occurs.
  // The `did-finish-loading` event only fires if successful.
  webview.addEventListener('did-stop-loading', () => {
    const url = webview.getURL();
    const title = webview.getTitle();

    dispatch(actions.setPageDetails(pageAccessor().id, {
      location: url,
      canGoBack: webview.canGoBack(),
      canGoForward: webview.canGoForward(),
      title,
    }));

    dispatch(actions.setStatusText(null));

    dispatch(actions.locationChanged(pageAccessor().id, {
      text: null,
    }));

    userAgent.createHistory(pageAccessor(), { url, title });
  });

  webview.addEventListener('did-finish-loading', () => {
    dispatch(actions.setPageState(pageAccessor().id, {
      state: PageState.STATES.LOADED,
    }));
  });

  webview.addEventListener('ipc-message', e => {
    switch (e.channel) {
      case 'status':
        dispatch(actions.setStatusText(e.args[0]));
        break;
      case 'contextmenu-data':
        menuWebViewContext(webview, e.args[0], dispatch, pageAccessor().sessionId);
        break;
      case 'show-bookmarks':
        logger.warn('@TODO: ipc-message:show-bookmarks');
        break;
      case 'metadata':
        dispatch(actions.setPageDetails(pageAccessor().id, {
          meta: e.args[0],
        }));
        break;
      default:
        logger.warn(`@TODO: Unknown ipc-message:${e.channel}`);
        break;
    }
  });

  webview.addEventListener('destroyed', () => {
    dispatch(actions.closeTab(pageAccessor().id));
  });
}
