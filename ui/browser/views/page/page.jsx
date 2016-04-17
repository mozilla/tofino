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

import Style from '../../browser-style';
import Status from './status.jsx';
import Search from './search.jsx';

import { fixURL } from '../../browser-util';
import { contextMenu, menuWebViewContext } from '../../actions/external';
import { closeTab, setPageDetails } from '../../actions/main-actions';
import * as profileCommands from '../../../../app/shared/profile-commands';

const PAGE_STYLE = Style.registerStyle({
  // Mark this as the relative anchor for floating children (e.g. search bar).
  position: 'relative',
  flex: 1,
});

const WEB_VIEW_INLINE_STYLE = {
  display: 'flex',
  flex: 1,
};

class Page extends Component {

  componentDidMount() {
    const { page, pageIndex, dispatch, ipcRenderer } = this.props;
    const { webview } = this.refs.webviewWrapper;

    addListenersToWebView(webview, page, pageIndex, dispatch, ipcRenderer);

    if (!page.guestInstanceId && page.location) {
      webview.setAttribute('src', fixURL(page.location));
    }
  }

  /**
   * After Page receives new properties, check to see if the id
   * of the latest command has changed and execute the command on WebView
   */
  componentDidUpdate({ page }) {
    const currentPage = this.props.page;
    const previousCommandId = page.executeCommand && page.executeCommand.id;
    const currentCommandId = currentPage.executeCommand && currentPage.executeCommand.id;
    if (previousCommandId !== currentCommandId) {
      this.executeCommand(currentPage.executeCommand);
    }
  }

  executeCommand(command) {
    const { webview } = this.webview;
    switch (command.command) {
      case 'back':
        webview.goBack();
        break;
      case 'forward':
        webview.goForward();
        break;
      case 'refresh':
        webview.reload();
        break;
      case 'navigate-to':
        webview.setAttribute('src', command.location);
        break;
      default:
        throw new Error(`Unknown command for WebView: ${command.command}`);
    }
  }

  render() {
    const { page, isActive, dispatch, pageIndex } = this.props;

    return (
      <div className={`${PAGE_STYLE} ${isActive ? 'active-browser-page' : ''}`}
        hidden={!isActive}>
        <Search hidden={!page.isSearching} />
        { /* Need to use `class` here instead of `className` since `WebViewWrapper`
           * is not a React component, therefore it expects real attributes.
           * Furthermore, actual styling needs to be applied inline and not via
           * selectors, because we want them to propagate onto the webview,
           * which doesn't have access to <style> sheets in this document. */ }
        <webview-wrapper ref="webviewWrapper"
          class={`webview-${pageIndex}`}
          style={WEB_VIEW_INLINE_STYLE}
          guestInstanceId={page.guestInstanceId}
          onContextMenu={() => dispatch(contextMenu())} />
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
  ipcRenderer: PropTypes.object.isRequired,
};

export default Page;

function addListenersToWebView(webview, page, pageIndex, dispatch, ipcRenderer) {
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
    const url = webview.getURL();
    dispatch(setPageDetails(pageIndex, {
      statusText: false,
      location: url,
      canGoBack: webview.canGoBack(),
      canGoForward: webview.canGoForward(),
      userTyped: null,
      isLoading: false,
    }));

    ipcRenderer.send('profile-command', profileCommands.visited(url));
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
    }
  });

  webview.addEventListener('destroyed', () => {
    dispatch(closeTab(pageIndex));
  });
}
