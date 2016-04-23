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

import Style from '../browser-style';
import TabBar from './tabbar/tabbar';
import DeveloperBar from './developerbar';
import NavBar from './navbar/navbar';
import Page from './page/page';

import {
  menuTabContext, menuLocationContext, menuBrowser, maximize, minimize, close,
} from '../actions/external';

import * as actions from '../actions/main-actions';
import '../../shared/web-view';

const BROWSER_WINDOW_STYLE = Style.registerStyle({
  flex: 1,
});

const CHROME_AREA_STYLE = Style.registerStyle({
  flexDirection: 'column',
  position: 'absolute',
  left: '0',
  right: '0',
  zIndex: '1',
});

const CONTENT_AREA_STYLE = Style.registerStyle({
  flex: 1,
});

class BrowserWindow extends Component {
  constructor(props) {
    super(props);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    document.body.addEventListener('keydown', this.handleKeyDown);
    attachIPCRendererListeners(this);
  }

  handleKeyDown({ metaKey, keyCode }) {
    const { dispatch, currentPage } = this.props;

    if (metaKey && keyCode === 70) { // cmd+f
      dispatch(actions.setPageDetails(currentPage.id, { isSearching: true }));
    } else if (keyCode === 27) { // esc
      dispatch(actions.setPageDetails(currentPage.id, { isSearching: false }));
    }
  }

  render() {
    const {
      currentPage, ipcRenderer, dispatch, profile, currentPageIndex, pageAreaVisible, pageIds
    } = this.props;

    const currentPageId = currentPage.id;

    const navBack = () => dispatch(actions.navigatePageBack(currentPageId));
    const navForward = () => dispatch(actions.navigatePageForward(currentPageId));
    const navRefresh = () => dispatch(actions.navigatePageRefresh(currentPageId));
    const openMenu = () => menuBrowser(dispatch);
    const isBookmarked = (url) => profile.bookmarks.has(url);
    const bookmark = (title, url) => {
      dispatch(actions.bookmark(url, title));
    };
    const unbookmark = (url) => {
      dispatch(actions.unbookmark(url));
    };
    const onLocationChange = e => {
      const text = e.target.value;
      dispatch(actions.setUserTypedLocation(currentPageId, {
        text,
      }));
    };
    const onLocationContextMenu = e => menuLocationContext(e.target, dispatch);
    const onLocationReset = () => {
      dispatch(actions.setUserTypedLocation(currentPageId, { text: void 0 }));
    };
    const setPageAreaVisibility = visible => dispatch(actions.setPageAreaVisibility(visible));
    const navigateTo = loc => dispatch(actions.navigatePageTo(currentPageId, loc));


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
              pageAreaVisible,
              ipcRenderer,
              setPageAreaVisibility,
              profile,
            }} />
          <TabBar handleTabClick={handleTabClick}
            handleTabClose={handleTabClose}
            handleTabContextMenu={handleTabContextMenu}
            handleNewTabClick={handleNewTabClick}
            {...this.props } />
        </div>
        <div className={CONTENT_AREA_STYLE}>
          {pageIds.map((pageId, pageIndex) => (
            <Page key={`page-${pageIndex}`}
              isActive={pageIndex === currentPageIndex}
              pageId={pageId}
              {...this.props} />
          ))}
        </div>
        <DeveloperBar />
      </div>
    );
  }
}

BrowserWindow.propTypes = {
  pageIds: PropTypes.arrayOf(React.PropTypes.string).isRequired,
  currentPage: PropTypes.object.isRequired,
  currentPageIndex: PropTypes.number.isRequired,
  dispatch: PropTypes.func.isRequired,
  ipcRenderer: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  pageAreaVisible: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  // @TODO restructure the state so this list is automatically created as new todos
  // are added instead of generated on each update pass
  pageIds: state.browserWindow.pages.toArray().map(page => page.id),
});

export default connect(mapStateToProps)(BrowserWindow);

function attachIPCRendererListeners(browserView) {
  const { dispatch, ipcRenderer } = browserView.props;

  ipcRenderer.on('profile-diff', (event, args) => {
    dispatch(args);
  });

  ipcRenderer.on('new-tab', () => dispatch(actions.createTab()));

  // TODO: Avoid this re-dispatch back to the main process
  ipcRenderer.on('new-window', () => {
    ipcRenderer.send('new-window');
  });

  ipcRenderer.on('show-bookmarks', () => {
    dispatch(actions.createTab('atom://bookmarks'));
  });

  ipcRenderer.on('open-bookmark', (e, bookmark) => {
    dispatch(actions.createTab(bookmark.url));
  });

  ipcRenderer.on('tab-attach', (e, tabInfo) => {
    const page = tabInfo.page;
    page.guestInstanceId = tabInfo.guestInstanceId;
    dispatch(actions.attachTab(page));
  });

  // @TODO main process should be sending an id to close a tab
  // most likely, not just whatever tab is currently open
  ipcRenderer.on('close-tab', () => {
    dispatch(actions.closeTab(browserView.props.currentPage.id));
  });

  // @TODO main process should be sending an id to refresh a tab
  // most likely, not just whatever tab is currently open
  ipcRenderer.on('page-reload', () => {
    dispatch(actions.navigatePageRefresh(browserView.props.currentPage.id));
  });
}
