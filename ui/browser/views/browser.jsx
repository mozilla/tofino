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
import TabBar from './tabbar/tabbar.jsx';
import NavBar from './navbar/navbar.jsx';
import Page from './page/page.jsx';

import {
  menuLocationContext, updateMenu, menuBrowser, maximize, minimize, close,
} from '../actions/external';

import {
  setPageAreaVisibility as setPageAreaVisibilityAction,
  createTab, attachTab, closeTab, setPageDetails,
  navigatePageBack, navigatePageForward, navigatePageRefresh, navigatePageTo,
  setUserTypedLocation,
} from '../actions/main-actions';

import * as mainActions from '../actions/main-actions';
import * as profileCommands from '../../../app/shared/profile-commands';

import '../../shared/web-view';

const BROWSER_WINDOW_STYLE = Style.registerStyle({
  width: '100%',
  height: '100%',
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

  componentDidMount() {
    document.body.addEventListener('keydown', this.handleKeyDown);

    updateMenu();
    attachIPCRendererListeners(this.props);
  }

  handleKeyDown({ metaKey, keyCode }) {
    const { dispatch, currentPageIndex } = this.props;

    if (metaKey && keyCode === 70) { // cmd+f
      dispatch(setPageDetails({ pageIndex: currentPageIndex, isSearching: true }));
    } else if (keyCode === 27) { // esc
      dispatch(setPageDetails({ pageIndex: currentPageIndex, isSearching: false }));
    }
  }

  render() {
    const {
      ipcRenderer, dispatch, profile, pages, currentPageIndex, pageAreaVisible,
    } = this.props;
    const navBack = () => dispatch(navigatePageBack(-1));
    const navForward = () => dispatch(navigatePageForward(-1));
    const navRefresh = () => dispatch(navigatePageRefresh(-1));
    const openMenu = () => menuBrowser(dispatch);
    const isBookmarked = (url) => profile.bookmarks.has(url);
    const bookmark = (title, url) => {
      // Update this window's state before telling the profile service.
      dispatch(mainActions.bookmark(url, title));
      ipcRenderer.send('profile-command',
        profileCommands.bookmark(url, title));
    };
    const unbookmark = (url) => {
      // Update this window's state before telling the profile service.
      dispatch(mainActions.unbookmark(url));
      ipcRenderer.send('profile-command',
        profileCommands.unbookmark(url));
    };
    const onLocationChange = e => dispatch(setUserTypedLocation({
      pageIndex: -1,
      text: e.target.value,
    }));
    const onLocationContextMenu = e => menuLocationContext(e.target, dispatch);
    const onLocationReset = () => dispatch(setUserTypedLocation({
      pageIndex: -1,
      text: void 0,
    }));
    const setPageAreaVisibility = (visible) => dispatch(setPageAreaVisibilityAction(visible));
    const navigateTo = loc => dispatch(navigatePageTo(-1, loc));

    return (
      <div className={BROWSER_WINDOW_STYLE} >
        <NavBar page={pages.get(currentPageIndex)}
          {...{ pages, navBack, navForward, navRefresh, minimize, maximize,
            close, openMenu, onLocationChange, onLocationContextMenu,
            onLocationReset, isBookmarked, bookmark, unbookmark, pageAreaVisible, ipcRenderer,
            setPageAreaVisibility, navigateTo }} />
        <TabBar {...{ pages, currentPageIndex, pageAreaVisible, dispatch }} />
        <div className={CONTENT_AREA_STYLE}>
          {pages.map((page, pageIndex) => (
            <Page key={`page-${pageIndex}`}
              page={page}
              pageIndex={pageIndex}
              isActive={pageIndex === currentPageIndex}
              ipcRenderer={ipcRenderer}
              dispatch={dispatch} />
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

  ipcRenderer.on('new-tab', () => dispatch(createTab()));

  // TODO: Avoid this re-dispatch back to the main process
  ipcRenderer.on('new-window', () => {
    ipcRenderer.send('new-window');
  });

  ipcRenderer.on('show-bookmarks', () => {
    dispatch(createTab('atom://bookmarks'));
  });

  ipcRenderer.on('open-bookmark', (e, bookmark) => {
    dispatch(createTab(bookmark.url));
  });

  ipcRenderer.on('tab-attach', (e, tabInfo) => {
    const page = tabInfo.page;
    page.guestInstanceId = tabInfo.guestInstanceId;
    dispatch(attachTab(page));
  });

  ipcRenderer.on('close-tab', () => {
    dispatch(closeTab(currentPageIndex));
  });

  ipcRenderer.on('page-reload', () => {
    dispatch(navigatePageRefresh(-1));
  });
}
