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
import { connect } from 'react-redux';
import { ipcRenderer } from '../../../shared/electron';

import Style from '../browser-style';
import * as SharedPropTypes from '../model/shared-prop-types';
import BrowserChrome from './browser-chrome';
import BrowserContent from './browser-content';
import DeveloperBar from './developerbar';
import WebViewController from '../lib/webview-controller';

import * as actions from '../actions/main-actions';
import * as external from '../actions/external';
import * as selectors from '../selectors';

const BROWSER_WINDOW_STYLE = Style.registerStyle({
  flexDirection: 'column',
  width: '100%',
  height: '100%',
});

class BrowserWindow extends Component {
  constructor(props) {
    super(props);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentWillMount() {
    this.webViewController = new WebViewController(() => this.props.pages);
  }

  componentDidMount() {
    document.body.addEventListener('keydown', this.handleKeyDown);
    attachIPCRendererListeners(this);
  }

  handleKeyDown(ev) {
    const { dispatch, currentPage } = this.props;

    if (ev.metaKey && ev.key === 'KeyF') { // cmd+f
      dispatch(actions.setPageDetails(currentPage.id, { isSearching: true }));
    } else if (ev.key === 'Escape') { // esc
      dispatch(actions.setPageDetails(currentPage.id, { isSearching: false }));
    }
  }

  render() {
    const { dispatch, currentPage, currentPageIndex, profile } = this.props;
    const webViewController = this.webViewController;

    const browserChromeMethods = {
      // Window methods.
      minimize: external.minimize,
      maximize: external.maximize,
      close: external.close,
      openMenu: external.menuBrowser,

      // Location & navigation methods.
      navBack: () => webViewController.navigateBack(currentPage.id),
      navForward: () => webViewController.navigateForward(currentPage.id),
      navRefresh: () => webViewController.navigateRefresh(currentPage.id),
      navigateTo: location => webViewController.navigateTo(currentPage.id, location),

      // Boorkmark handling methods.
      bookmark: (title, url) => dispatch(actions.bookmark(currentPage.sessionId, url, title)),
      unbookmark: url => dispatch(actions.unbookmark(currentPage.sessionId, url)),
      isBookmarked: url => profile.bookmarks.has(url),

      // NavBar methods.
      onClearCompletions: () => dispatch(actions.clearCompletions()),
      onLocationChange: e => {
        dispatch(actions.setUserTypedLocation(currentPage.id, { text: e.target.value }));
      },
      onLocationReset: () => dispatch(actions.locationChanged(currentPage.id, { text: null })),
      onLocationContextMenu: e => external.menuLocationContext(e.target, currentPage.id, dispatch),

      // TabBar methods.
      handleNewTabClick: () => dispatch(actions.createTab()),
      handleTabContextMenu: pageId => () => external.menuTabContext(pageId, dispatch),
      handleTabClick: pageId => e => {
        dispatch(e.button === 1
          ? actions.closeTab(pageId)
          : actions.setCurrentTab(pageId));
      },
      handleTabClose: pageId => e => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(actions.closeTab(pageId));
      },
    };

    return (
      <div className={BROWSER_WINDOW_STYLE}>
        <BrowserChrome page={currentPage}
          {...this.props}
          {...browserChromeMethods}
          {...{ ipcRenderer }} />
        <BrowserContent currentPageIndex={currentPageIndex}
          webViewController={webViewController}
          {...this.props} />
        <DeveloperBar />
      </div>
    );
  }
}

BrowserWindow.displayName = 'BrowserWindow';

BrowserWindow.propTypes = {
  dispatch: PropTypes.func.isRequired,
  pages: SharedPropTypes.Pages.isRequired,
  currentPage: SharedPropTypes.Page.isRequired,
  currentPageIndex: PropTypes.number.isRequired,
  profile: SharedPropTypes.Profile.isRequired,
};

function mapStateToProps(state) {
  return {
    pages: selectors.getPages(state),
    currentPage: selectors.getCurrentPage(state),
    currentPageIndex: selectors.getCurrentPageIndex(state),
    profile: selectors.getProfile(state),
  };
}

export default connect(mapStateToProps)(BrowserWindow);

function attachIPCRendererListeners(browserView) {
  const { webViewController } = browserView;
  const { props: { dispatch } } = browserView;

  ipcRenderer.on('select-tab-index', (_, index) => {
    const page = browserView.props.pages.get(index);
    if (page) {
      dispatch(actions.setCurrentTab(page.id));
    }
  });

  ipcRenderer.on('select-tab-previous', () => dispatch(actions.setCurrentTabPrevious()));
  ipcRenderer.on('select-tab-next', () => dispatch(actions.setCurrentTabNext()));

  ipcRenderer.on('profile-diff', (_, args) => dispatch(args));
  ipcRenderer.on('new-tab', () => dispatch(actions.createTab()));
  ipcRenderer.on('close-tab', () => dispatch(actions.closeTab(browserView.props.currentPage.id)));

  // @TODO main process should be sending an id to refresh a tab
  // most likely, not just whatever tab is currently open
  ipcRenderer.on('page-refresh', () =>
    webViewController.navigateRefresh(browserView.props.currentPage.id));

  // @TODO write tests for the following actions
  ipcRenderer.on('show-stars', () => dispatch(actions.createTab('tofino://stars')));
  ipcRenderer.on('show-history', () => dispatch(actions.createTab('tofino://history')));
  ipcRenderer.on('focus-url-bar', () => {});
  ipcRenderer.on('open-bookmark', (_, bookmark) => dispatch(actions.createTab(bookmark.location)));

  ipcRenderer.on('capture-page', () =>
    webViewController.capturePage(browserView.props.currentPage.id));
}
