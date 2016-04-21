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
import NavBar from './navbar/navbar';
import Page from './page/page';

import {
  menuLocationContext, menuBrowser, maximize, minimize, close,
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
    attachIPCRendererListeners(this.props);
  }

  handleKeyDown({ metaKey, keyCode }) {
    const { dispatch, currentPageIndex } = this.props;

    if (metaKey && keyCode === 70) { // cmd+f
      dispatch(actions.setPageDetails({ pageIndex: currentPageIndex, isSearching: true }));
    } else if (keyCode === 27) { // esc
      dispatch(actions.setPageDetails({ pageIndex: currentPageIndex, isSearching: false }));
    }
  }

  render() {
    const { ipcRenderer, dispatch, profile, pages, currentPageIndex, pageAreaVisible } = this.props;
    const currentPage = pages.get(currentPageIndex);

    const navBack = () => dispatch(actions.navigatePageBack(-1));
    const navForward = () => dispatch(actions.navigatePageForward(-1));
    const navRefresh = () => dispatch(actions.navigatePageRefresh(-1));
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
      dispatch(actions.setUserTypedLocation({
        pageIndex: -1,
        text,
      }));
    };
    const onLocationContextMenu = e => menuLocationContext(e.target, dispatch);
    const onLocationReset = () => {
      const text = void 0;
      dispatch(actions.setUserTypedLocation({
        pageIndex: -1,
        text,
      }));
    };
    const setPageAreaVisibility = visible => dispatch(actions.setPageAreaVisibility(visible));
    const navigateTo = loc => dispatch(actions.navigatePageTo(-1, loc));

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
            }} />
          <TabBar {...this.props } />
        </div>
        <div className={CONTENT_AREA_STYLE}>
          {pages.map((page, pageIndex) => (
            <Page key={`page-${pageIndex}`}
              isActive={pageIndex === currentPageIndex}
              page={page}
              pageIndex={pageIndex}
              {...this.props} />
          ))}
        </div>
      </div>
    );
  }
}

BrowserWindow.propTypes = {
  pages: PropTypes.object.isRequired,
  currentPageIndex: PropTypes.number.isRequired,
  dispatch: PropTypes.func.isRequired,
  ipcRenderer: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  pageAreaVisible: PropTypes.bool.isRequired,
};

export default BrowserWindow;

function attachIPCRendererListeners({ dispatch, currentPageIndex, ipcRenderer }) {
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

  ipcRenderer.on('close-tab', () => {
    dispatch(actions.closeTab(currentPageIndex));
  });

  ipcRenderer.on('page-reload', () => {
    dispatch(actions.navigatePageRefresh(-1));
  });
}
