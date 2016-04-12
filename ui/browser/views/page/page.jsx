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

import Status from './status.jsx';
import Search from './search.jsx';

import { fixURL } from '../../browser-util';
import { contextMenu, menuWebViewContext } from '../../actions/external';
import { closeTab, setPageDetails } from '../../actions/main-actions';

/**
 * A Page is made up of an in-page search component, a web-view and a status
 * bar.
 * It's a heavyweight component because it needs to do things on mount
 */
class Page extends Component {
  componentDidMount() {
    const { page, pageIndex, dispatch, browserDB } = this.props;
    const webview = this.webview.webview;

    addListenersToWebView(webview, page, pageIndex, dispatch, browserDB);

    // set location, if given
    if (!page.guestInstanceId && page.location) {
      this.webview.webview.setAttribute('src', fixURL(page.location));
    }
  }

  render() {
    const { page, isActive, dispatch, pageIndex } = this.props;

    return (
      <div id="browser-page" className={isActive ? 'visible' : 'hidden'}>
        <Search isActive={page.isSearching} />
        <web-view className={`webview-${pageIndex}`}
          ref={node => { if (node != null) this.webview = node; }}
          guestinstance={page.guestInstanceId}
          onContextMenu={() => dispatch(contextMenu())}
          style={{ height: '100%' /* I have no idea why we need this */ }} />
        <Status page={page} />
      </div>
    );
  }
}

Page.propTypes = {
  page: PropTypes.object.isRequired,
  pageIndex: PropTypes.number.isRequired,
  isActive: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default Page;

/**
 * WebView wasn't designed for React...
 */
function addListenersToWebView(webview, page, pageIndex, dispatch, browserDB) {
  webview.addEventListener('did-start-loading', () => {
    dispatch(setPageDetails(pageIndex, {
      isLoading: true,
      title: false,
    }));
  });

  webview.addEventListener('dom-ready', () => {
    dispatch(setPageDetails(pageIndex, {
      canGoBack: webview.canGoBack(),
      canGoForward: webview.canGoForward(),
      canRefresh: true,
    }));
  });

  webview.addEventListener('page-title-set', e => {
    dispatch(setPageDetails(pageIndex, {
      title: e.title,
      location: webview.getURL(),
    }));
  });

  webview.addEventListener('did-stop-loading', () => {
    dispatch(setPageDetails(pageIndex, {
      statusText: false,
      location: webview.getURL(),
      canGoBack: webview.canGoBack(),
      canGoForward: webview.canGoForward(),
      userTyped: null,
      isLoading: false,
    }));

    browserDB.bookmarks.where('url').equals(page.location).count((count) => {
      dispatch(setPageDetails(pageIndex, {
        isBookmarked: (count > 0),
      }));
    });
  });

  webview.addEventListener('ipc-message', e => {
    if (e.channel === 'status') {
      dispatch(setPageDetails(pageIndex, {
        statusText: e.args[0],
      }));
    } else if (e.channel === 'contextmenu-data') {
      menuWebViewContext(e.args[0], dispatch);
    } else if (e.channel === 'show-bookmarks') {
      // console.log('got a menu');
    } else if (e.channel === 'close-tab') {
      dispatch(closeTab(pageIndex));
    }
  });

  webview.addEventListener('ipc-message', e => {
    if (e.channel === 'channel-message' && e.args[1] === 'bookmarks-update') {
      browserDB.bookmarks.toArray().then((bookmarks) => {
        webview.send('channel-message', 'host', 'bookmarks-data', bookmarks);
      });
    }
  });

  webview.addEventListener('destroyed', () => {
    dispatch(closeTab(pageIndex));
  });
}
