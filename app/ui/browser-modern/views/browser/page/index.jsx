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
});

class Page extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  componentDidMount() {
    this.addWebviewListeners();
    this.props.onMount(this.props.pageId, this.props.pageLocation);
  }

  addWebviewListeners() {
    // See http://electron.atom.io/docs/api/web-view-tag/#dom-events

    this.webview.addEventListener('new-window', e => {
      // Increment the index for the new page to be adjacent to this one
      const index = this.props.pageIndex + 1;
      const selected = e.disposition && e.disposition === 'foreground-tab';
      this.props.dispatch(PageEffects.createPageSession(e.url, { selected, index }));
    });

    this.webview.addEventListener('did-start-loading', () => {
      // First event fired when a page loads.
      // May be emitted multiple times for every single frame.
      this.props.dispatch(PageActions.setPageState(this.props.pageId, {
        load: PageState.STATES.LOADING,
      }));
    });

    this.webview.addEventListener('did-navigate', () => {
      // Event fired when a page loads, after `did-start-loading`.
      // Only emitted once.
      const url = this.webview.getURL();
      const isTofino = url.startsWith(Endpoints.TOFINO_PROTOCOL);
      this.props.dispatch(PageActions.setPageDetails(this.props.pageId, { location: url }));
      this.props.dispatch(UIEffects.setURLBarValue(this.props.pageId, url));
      this.props.dispatch(UIEffects.focusURLBar(this.props.pageId, { select: isTofino }));
    });

    this.webview.addEventListener('did-navigate-in-page', e => {
      // Like `did-navigate`, but fired only when an in-page navigation happens,
      // meaning that the page URL changes but does not cause navigation outside
      // of the page (e.g. when the hashchange event is triggered).
      if (!e.isMainFrame || e.url === this.props.pageLocation) {
        return;
      }
      this.props.dispatch(PageActions.setPageDetails(this.props.pageId, { location: e.url }));
      this.props.dispatch(UIEffects.setURLBarValue(this.props.pageId, e.url));
      this.props.dispatch(ProfileEffects.addRemoteHistory(this.props.pageId));
    });

    this.webview.addEventListener('did-finish-load', () => {
      // Event fired when the navigation is done and onload event is dispatched.
      // May be emitted multiple times for every single frame.
      // Not emitted when a failure occurs, unlike `did-stop-loading`.
      // Might not always be emitted after a `did-start-loading`.
    });

    this.webview.addEventListener('did-fail-load', () => {
      // Like 'did-finish-load', but fired when the load failed or was cancelled.
      // May be emitted multiple times for every single frame.
      // Only emitted when a failure occurs, unlike `did-stop-loading`.
      this.props.dispatch(PageActions.setPageState(this.props.pageId, {
        load: PageState.STATES.FAILED,
      }));
    });

    this.webview.addEventListener('did-stop-loading', () => {
      // Event fired when a page finishes loading.
      // May be emitted multiple times for every single frame.
      // Emitted regardless of whether or not a failure occurs.
      this.props.dispatch(PageActions.setPageState(this.props.pageId, {
        load: PageState.STATES.LOADED,
      }));
    });

    this.webview.addEventListener('page-title-set', e => {
      this.props.dispatch(PageActions.setPageDetails(this.props.pageId, { title: e.title }));
      // Make sure we record this page navigation in the remote history
      // only after we have a title available.
      this.props.dispatch(ProfileEffects.addRemoteHistory(this.props.pageId));
    });

    this.webview.addEventListener('page-favicon-updated', e => {
      this.props.dispatch(PageActions.setPageDetails(this.props.pageId, {
        favicon_url: e.favicons[0],
      }));
    });

    this.webview.addEventListener('dom-ready', () => {
      this.props.dispatch(PageActions.setPageState(this.props.pageId, {
        canGoBack: this.webview.canGoBack(),
        canGoForward: this.webview.canGoForward(),
        canRefresh: true,
      }));
    });

    this.webview.addEventListener('update-target-url', e => {
      this.props.dispatch(UIActions.setStatusText(e.url));
    });

    this.webview.addEventListener('ipc-message', e => {
      switch (e.channel) {
        case 'metadata':
          this.props.dispatch(PageActions.setPageMeta(this.props.pageId, e.args[0]));
          break;
        default:
          logger.warn(`@TODO: Unknown ipc-message:${e.channel}`);
          break;
      }
    });
  }

  render() {
    return (
      <div id={`browser-page-${this.props.pageId}`}
        className={`browser-page ${PAGE_STYLE}`}>
        <webview is="webview"
          ref={e => this.webview = e}
          class={WEB_VIEW_STYLE}
          preload="../preload/index.js" />
      </div>
    );
  }
}

Page.displayName = 'Page';

Page.propTypes = {
  dispatch: PropTypes.func.isRequired,
  pageId: PropTypes.string.isRequired,
  pageLocation: PropTypes.string.isRequired,
  pageIndex: PropTypes.number.isRequired,
  onMount: PropTypes.func.isRequired,
};

function mapStateToProps(state, ownProps) {
  const page = PagesSelectors.getPageById(state, ownProps.pageId);
  return {
    pageLocation: page ? page.location : '',
    pageIndex: PagesSelectors.getPageIndexById(state, ownProps.pageId),
  };
}

export default connect(mapStateToProps)(Page);
