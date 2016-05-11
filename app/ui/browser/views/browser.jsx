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

import Style from '../browser-style';
import TabBar from './tabbar/tabbar';
import DeveloperBar from './developerbar';
import NavBar from './navbar/navbar';
import Page from './page/page';
import WebViewController from '../webview-controller';

import {
  menuTabContext, menuLocationContext, menuBrowser, maximize, minimize, close,
} from '../actions/external';

import * as actions from '../actions/main-actions';
import * as ipcActions from '../actions/ipc';

const BROWSER_WINDOW_STYLE = Style.registerStyle({
  flex: 1,
  flexDirection: 'column',
});

const CHROME_AREA_STYLE = Style.registerStyle({
  flexDirection: 'column',
});

const CONTENT_AREA_STYLE = Style.registerStyle({
  flex: 1,
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
    const {
      currentPage, ipcRenderer, dispatch, profile, pages, currentPageIndex,
    } = this.props;

    const webViewController = this.webViewController;
    const currentPageId = currentPage.id;

    const navBack = () => webViewController.navigateBack(currentPageId);
    const navForward = () => webViewController.navigateForward(currentPageId);
    const navRefresh = () => webViewController.navigateRefresh(currentPageId);
    const navigateTo = loc => webViewController.navigateTo(currentPageId, loc);

    const openMenu = () => menuBrowser(currentPage.sessionId, dispatch);
    const isBookmarked = (url) => profile.bookmarks.has(url);
    const bookmark = (title, url) => {
      dispatch(actions.bookmark(currentPage.sessionId, url, title));
    };
    const unbookmark = (url) => {
      dispatch(actions.unbookmark(currentPage.sessionId, url));
    };
    const onLocationChange = e => {
      const text = e.target.value;
      dispatch(actions.setUserTypedLocation(currentPageId, {
        text,
      }));
    };
    const onLocationContextMenu = e => menuLocationContext(e.target, currentPageId, dispatch);
    const onLocationReset = () => {
      dispatch(actions.setUserTypedLocation(currentPageId, { text: void 0 }));
    };

    /**
     * TabBar functions
     */
    const handleTabContextMenu = pageId => () => menuTabContext(pageId, dispatch);
    const handleNewTabClick = () => dispatch(actions.createTab());
    const handleTabClick = pageId => e =>
      dispatch(e.button === 1 ? actions.closeTab(pageId) : actions.setCurrentTab(pageId));
    const handleTabClose = pageId => e => {
      e.preventDefault();
      e.stopPropagation();
      dispatch(actions.closeTab(pageId));
    };

    return (
      <div className={BROWSER_WINDOW_STYLE}>
        <div className={CHROME_AREA_STYLE}>
          <NavBar page={currentPage}
            {...{
              navBack,
              navForward,
              navRefresh,
              navigateTo,
              minimize,
              maximize,
              close,
              pages,
              openMenu,
              onLocationChange,
              onLocationContextMenu,
              onLocationReset,
              isBookmarked,
              bookmark,
              unbookmark,
              ipcRenderer,
              profile,
            }} />
          <TabBar handleTabClick={handleTabClick}
            handleTabClose={handleTabClose}
            handleTabContextMenu={handleTabContextMenu}
            handleNewTabClick={handleNewTabClick}
            {...this.props } />
        </div>
        <div className={CONTENT_AREA_STYLE}>
          {pages.map((page, pageIndex) => (
            <Page key={`page-${page.id}`}
              isActive={pageIndex === currentPageIndex}
              page={page}
              webViewController={webViewController}
              {...this.props} />
          ))}
        </div>
        <DeveloperBar />
      </div>
    );
  }
}

BrowserWindow.propTypes = {
  pages: PropTypes.object.isRequired,
  currentPage: PropTypes.object.isRequired,
  currentPageIndex: PropTypes.number.isRequired,
  dispatch: PropTypes.func.isRequired,
  ipcRenderer: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};

export default BrowserWindow;

function attachIPCRendererListeners(browserView) {
  const { dispatch, ipcRenderer } = browserView.props;
  const { webViewController } = browserView;

  ipcRenderer.on('select-tab-index', (_, index) => {
    const page = browserView.props.pages.get(index);
    if (page) {
      dispatch(actions.setCurrentTab(page.id));
    }
  });

  ipcRenderer.on('select-tab-previous', () => dispatch(actions.setCurrentTabPrevious()));
  ipcRenderer.on('select-tab-next', () => dispatch(actions.setCurrentTabNext()));

  ipcRenderer.on('profile-diff', (_, args) => dispatch(args));
  ipcRenderer.on('focus-url-bar', () => dispatch(ipcActions.focusURLBar()));
  ipcRenderer.on('new-tab', () => dispatch(actions.createTab()));
  ipcRenderer.on('close-tab', () =>
    dispatch(actions.closeTab(browserView.props.currentPage.id)));

  // @TODO main process should be sending an id to refresh a tab
  // most likely, not just whatever tab is currently open
  ipcRenderer.on('page-refresh', () =>
    webViewController.navigateRefresh(browserView.props.currentPage.id));

  ipcRenderer.on('show-stars', () => dispatch(actions.createTab('tofino://stars')));
  ipcRenderer.on('show-history', () => dispatch(actions.createTab('tofino://history')));
  ipcRenderer.on('open-bookmark',
    (_event, bookmark) => dispatch(ipcActions.openBookmark(bookmark)));
}
