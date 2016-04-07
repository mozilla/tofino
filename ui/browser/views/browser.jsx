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

import browserDB from '../../shared/browser-db';
import TabBar from './tabbar/tabbar.jsx';
import NavBar from './navbar/navbar.jsx';
import Page from './page/page.jsx';

import {
  bookmark, unbookmark, menuLocationContext,
  updateMenu, menuBrowser, maximize, minimize, close
} from '../actions/external';
import { createTab, attachTab, setPageDetails, setLocation } from '../actions/main-actions';
import { getCurrentWebView } from '../browser-util';

import { platform } from '../../../build-config';

require('../../shared/web-view');

/**
 *
 */
class BrowserWindow extends Component {
  componentDidMount() {
    attachListeners(this.props);
  }

  render() {
    const { dispatch, pages, currentPageIndex, pageOrder, ipcRenderer } = this.props;
    const platformClass = `platform-${platform}`;
    const navBack = e => getCurrentWebView(e.target.ownerDocument).goBack();
    const navForward = e => getCurrentWebView(e.target.ownerDocument).goForward();
    const navRefresh = e => getCurrentWebView(e.target.ownerDocument).reload();
    const openMenu = () => menuBrowser(dispatch);

    return (
      <div id="browser-chrome" className={"platform-" + platform} >
        <NavBar page={pages.get(currentPageIndex)}
                pages={pages}
                navBack={navBack}
                navForward={navForward}
                navRefresh={navRefresh}
                minimize={minimize}
                maximize={maximize}
                close={close}
                openMenu={openMenu}
                bookmark={(title, url) => bookmark(title, url, dispatch)}
                unbookmark={url => unbookmark(url, dispatch)}
                onLocationChange={e => dispatch(setLocation(e.target.value))}
                onLocationContextMenu={e => menuLocationContext(e.target, dispatch)}
                onLocationReset={() => dispatch(setLocation())}
                ipcRenderer={ipcRenderer} />
        <TabBar {...{ pages, pageOrder, currentPageIndex, dispatch }} />
        <div id="content-area">
          {pages.map((page, pageIndex) => (
            <Page key={'page-' + pageIndex}
              page={page} pageIndex={pageIndex}
              isActive={pageIndex === currentPageIndex}
              browserDB={browserDB} />
              dispatch={dispatch}
              isActive={pageIndex === currentPageIndex} />
          ))}
        </div>
      </div>
    );
  }
}

BrowserWindow.propTypes = {
  pageOrder: PropTypes.object.isRequired,
  pages: PropTypes.object.isRequired,
  currentPageIndex: PropTypes.number.isRequired,
  dispatch: PropTypes.func.isRequired,
  ipcRenderer: PropTypes.object.isRequired,
};

export default BrowserWindow;

function attachListeners({ dispatch, currentPageIndex, ipcRenderer }) {
  // attach keyboard shortcuts
  // :TODO: replace this with menu hotkeys
  document.body.addEventListener('keydown', e => {
    if (e.metaKey && e.keyCode === 70) { // cmd+f
      setPageDetails(pageIndex, { isSearching: true });
      e.target.ownerDocument.querySelector('#browser-page-search input').focus();
    } else if (e.keyCode === 27) { // esc
      setPageDetails(pageIndex, { isSearching: false });
      e.target.ownerDocument.querySelector('#browser-page-search input').blur();
    }
  });

  // Setup the app menu
  updateMenu();

  ipcRenderer.on('new-tab', () => dispatch(createTab()));

  // TODO: Avoid this Re-dispatch back to the main process
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
}
