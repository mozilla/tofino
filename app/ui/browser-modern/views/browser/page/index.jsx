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

import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import { logger } from '../../../../../shared/logging';

import Style from '../../../../shared/style';
import ErrorPage from './error-page';

import PageState from '../../../model/page-state';
import * as Endpoints from '../../../../../shared/constants/endpoints';
import * as UIActions from '../../../actions/ui-actions';
import * as UIEffects from '../../../actions/ui-effects';
import * as ProfileEffects from '../../../actions/profile-effects';
import * as PageActions from '../../../actions/page-actions';
import * as PageEffects from '../../../actions/page-effects';
import * as PagesSelectors from '../../../selectors/pages';

const PAGE_STYLE = Style.registerStyle({
  flex: 1,
});

const WEB_VIEW_STYLE = Style.registerStyle({
  display: 'flex',
  flex: 1,
  background: '#fff',
  '&[data-prevent-interaction=true]': {
    pointerEvents: 'none',
  },
});

class Page extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  componentDidMount() {
    this.addWebviewListeners();
    this.props.dispatch(PageEffects.navigatePageToInitial(this.props.pageId));
  }

  addWebviewListeners() {
    // See http://electron.atom.io/docs/api/web-view-tag/#dom-events

    this.webview.addEventListener('new-window', e => {
      this.props.dispatch((dispatch, getState) => {
        // Increment the index for the new page to be adjacent to this one.
        const selected = e.disposition && e.disposition === 'foreground-tab';
        const pageIndex = PagesSelectors.getPageIndexById(getState(), this.props.pageId) + 1;
        dispatch(PageEffects.createPageSession(e.url, { selected, index: pageIndex }));
      });
    });

    this.webview.addEventListener('did-start-loading', () => {
      // First event fired when a page loads.
      // May be emitted multiple times for every single frame.
      this.props.dispatch(PageActions.setPageState(this.props.pageId, {
        load: PageState.STATES.LOADING,
      }));
    });

    this.webview.addEventListener('did-navigate', e => {
      // Event fired when a page loads, after `did-start-loading`.
      // Only emitted once.
      const pageId = this.props.pageId;
      const isTofino = e.url.startsWith(Endpoints.TOFINO_PROTOCOL);
      const webContents = this.webview.getWebContents();
      const history = webContents.history;
      const historyIndex = webContents.getActiveIndex();
      this.props.dispatch(PageActions.setPageDetails(pageId, { location: e.url }));
      this.props.dispatch(PageActions.setLocalPageHistory(pageId, history, historyIndex));
      this.props.dispatch(UIEffects.setURLBarValue(pageId, e.url));
      this.props.dispatch(UIEffects.focusURLBar(pageId, { select: isTofino }));
    });

    this.webview.addEventListener('did-navigate-in-page', e => {
      // Like `did-navigate`, but fired only when an in-page navigation happens,
      // meaning that the page URL changes but does not cause navigation outside
      // of the page (e.g. when the hashchange event is triggered).
      if (!e.isMainFrame) {
        return;
      }
      const pageId = this.props.pageId;
      const webContents = this.webview.getWebContents();
      const history = webContents.history;
      const historyIndex = webContents.getActiveIndex();
      this.props.dispatch(PageActions.setPageDetails(pageId, { location: e.url }));
      this.props.dispatch(PageActions.setLocalPageHistory(pageId, history, historyIndex));
      this.props.dispatch(UIEffects.setURLBarValue(pageId, e.url));
      this.props.dispatch(ProfileEffects.addRemoteHistory(pageId));
    });

    this.webview.addEventListener('did-stop-loading', () => {
      // Event fired when a page finishes loading.
      // May be emitted multiple times for every single frame.
      // Emitted regardless of whether or not a failure occurs.
      const title = this.webview.getTitle();
      const location = this.webview.getURL();

      // The `page-title-set` event is not called on error pages, nor is
      // the `did-navigate` event called, so we must set these properties to
      // properly render our error pages
      this.props.dispatch(PageActions.setPageDetails(this.props.pageId, { title, location }));
      this.props.dispatch(UIEffects.setURLBarValue(this.props.pageId, location));

      // If the page state is still LOADING, and we haven't hit a failure state,
      // mark this page as LOADED. The logic for setting the proper load state
      // is in the reducer.
      this.props.dispatch(PageActions.setPageState(this.props.pageId, {
        load: PageState.STATES.LOADED,
      }));
    });

    this.webview.addEventListener('did-fail-load', e => {
      // Like 'did-finish-load', but fired when the load failed or was cancelled.
      // May be emitted multiple times for every single frame.
      // Only emitted when a failure occurs, unlike `did-stop-loading`.
      // Is fired before did-finish-load and did-stop-loading when failure occurs.
      if (!e.isMainFrame) {
        return;
      }

      const pageId = this.props.pageId;
      const { errorCode, errorDescription, validatedURL } = e;

      // If a page is aborted (like hitting BACK/RELOAD while a page is loading), we'll get a
      // load failure of ERR_ABORTED with code `-3` -- this is intended, so just ignore it.
      if (Math.abs(errorCode) === 3) {
        return;
      }

      const state = {
        load: PageState.STATES.FAILED,
        code: errorCode,
        description: errorDescription,
      };

      const details = {
        location: validatedURL,
      };

      // Most cert errors are 501 from this event; the true, more descriptive
      // error description can be retrieved from the main process. Just check
      // here roughly if the error looks like a cert error.
      if (Math.abs(errorCode) === 501 || /CERT/.test(errorDescription)) {
        this.props.dispatch(PageEffects.getCertificateError(pageId, validatedURL));
      }

      this.props.dispatch(PageActions.setPageState(pageId, state));
      this.props.dispatch(PageActions.setPageDetails(pageId, details));
      this.props.dispatch(UIEffects.setURLBarValue(pageId, validatedURL));
    });

    this.webview.addEventListener('did-finish-load', e => {
      // Event fired when the navigation is done and onload event is dispatched.
      // May be emitted multiple times for every single frame.
      // Might not always be emitted after a `did-start-loading`.
      if (!e.isMainFrame) {
        return;
      }
      this.props.dispatch(PageEffects.parsePageMetaData(this.props.pageId));
    });

    this.webview.addEventListener('did-frame-finish-load', e => {
      // Like `did-finish-load`, but fired only when an in-page load happens.
      // Parse the page metadata everytime something stops loading, to properly
      // handle in-page content changing and in-page navigations.
      if (!e.isMainFrame) {
        return;
      }
      this.props.dispatch(PageEffects.parsePageMetaData(this.props.pageId));
    });

    this.webview.addEventListener('page-title-set', e => {
      // Not emitted when pages don't have a title.
      this.props.dispatch(PageActions.setPageDetails(this.props.pageId, { title: e.title }));
    });

    this.webview.addEventListener('page-favicon-updated', e => {
      this.props.dispatch(PageActions.setPageDetails(this.props.pageId, {
        faviconUrl: e.favicons[0],
      }));
    });

    this.webview.addEventListener('dom-ready', () => {
      // Make sure we record this page navigation in the remote history
      // only after we have a title available. However, we can't do it in
      // the `page-title-set` because that event isn't fired when no title
      // is available.
      this.props.dispatch(ProfileEffects.addRemoteHistory(this.props.pageId));
    });

    this.webview.addEventListener('update-target-url', e => {
      this.props.dispatch(UIActions.setStatusText(e.url));
    });

    this.webview.addEventListener('ipc-message', e => {
      switch (e.channel) {
        case 'contextmenu-data':
          this.props.dispatch(PageEffects.displayWebviewContextMenu(this.props.pageId, e.args[0]));
          break;
        case 'focus-data':
          this.props.dispatch(UIEffects.setContentActiveElement(e.args[0]));
          break;
        default:
          logger.warn(`@TODO: Unknown ipc-message:${e.channel}`);
          break;
      }
    });

    // We cannot bind click events on the actual webview node, but mousedown
    // works, so convert that to a propogated click.
    this.webview.addEventListener('mousedown', e => {
      this.handleWebviewClick(e);
    });
  }

  /**
   * Intercept and propogate clicks from the webview so we can react (like close popups)
   * on events from webview.
   */
  handleWebviewClick() {
    const ev = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
      relatedTarget: this.webview,
    });
    this.webview.dispatchEvent(ev);
  }

  requestContextData = e => {
    const { offsetX: x, offsetY: y } = e.nativeEvent;
    this.webview.send('get-contextmenu-data', { x, y });
  }

  render() {
    // Use the renderer process' user agent string, as we can't get/set the webview's UA string
    // until after it's mounted and after a dom-ready, and strip out the Electron version
    // (e.g. "Electron/1.4.2") for web compatibility reasons
    const ua = window.navigator.userAgent.replace(/Electron\/[\d\.]* /, '');

    return (
      <div id={`browser-page-${this.props.pageId}`}
        className={`browser-page ${PAGE_STYLE}`}>
        <ErrorPage pageId={this.props.pageId} />
        <webview is="webview"
          ref={e => this.webview = e}
          useragent={ua}
          class={WEB_VIEW_STYLE}
          data-prevent-interaction={this.props.preventInteraction}
          onContextMenu={this.requestContextData}
          preload="../preload/index.js" />
      </div>
    );
  }
}

Page.displayName = 'Page';

Page.propTypes = {
  dispatch: PropTypes.func.isRequired,
  pageId: PropTypes.string.isRequired,
  preventInteraction: PropTypes.bool.isRequired,
};

function mapStateToProps(state, ownProps) {
  return {
    preventInteraction: PagesSelectors.getPagePreventInteraction(state, ownProps.pageId),
  };
}

export default connect(mapStateToProps)(Page);
