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

import * as UIConstants from '../../constants/ui';
import Style from '../../browser-style';

import Status from './status';
import Search from './search';

import { fixURL } from '../../browser-util';
import { contextMenu, menuWebViewContext } from '../../actions/external';
import { closeTab, setPageDetails, setUserTypedLocation } from '../../actions/main-actions';
import * as profileCommands from '../../../../shared/profile-commands';

const PAGE_STYLE = Style.registerStyle({
  // Hide the overflow for pages because when applying a `translateY` to the webview element,
  // a scrollbar appears for the browser window, due to shifting everything vertically.
  overflow: 'hidden',

  // Mark this as the relative anchor for floating children (e.g. search bar).
  position: 'relative',
  flex: 1,
});

const WEB_VIEW_WRAPPER_STYLE = {
  display: 'flex',
  flex: 1,
  transition: 'transform 0.3s ease-in-out',
};

const WEB_VIEW_WRAPPER_CHROME_EXPANDED_STYLE = {
  transform: `translateY(${UIConstants.NAVBAR_EXPANDED_HEIGHT}px)`,
};

const WEB_VIEW_WRAPPER_CHROME_COLLAPSED_STYLE = {
  transform: 'none',
};

const WEB_VIEW_INNER_STYLE = {
  display: 'flex',
  flex: 1,
};

class Page extends Component {
  componentDidMount() {
    const { page, dispatch, ipcRenderer } = this.props;
    const { webview } = this.refs.webviewWrapper;

    addListenersToWebView(webview, page, dispatch, ipcRenderer);

    if (!page.guestInstanceId && page.location) {
      webview.setAttribute('src', fixURL(page.location));
    }
  }

  /**
   * After Page receives new properties, iterate over the new commands
   * in the queue and execute them.
   *
   * @TODO This queue grows indefinitely. We should drain it somehow in a
   * Reduxy way.
   */
  componentDidUpdate({ page }) {
    const currentPage = this.props.page;
    if (page.commands.size !== currentPage.commands.size) {
      for (let i = page.commands.size; i < currentPage.commands.size; i++) {
        this.executeCommand(currentPage.commands.get(i));
      }
    }
  }

  executeCommand(command) {
    const { webview } = this.refs.webviewWrapper;
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
        webview.setAttribute('src', fixURL(command.location));
        break;
      default:
        throw new Error(`Unknown command for WebView: ${command.command}`);
    }
  }

  render() {
    return (
      <div className={`${PAGE_STYLE} ${this.props.isActive ? 'active-browser-page' : ''}`}
        hidden={!this.props.isActive}>
        <Search hidden={!this.props.page.isSearching} />
        { /* Need to use `class` here instead of `className` since `WebViewWrapper`
           * is not a React component, therefore it expects real attributes.
           * Furthermore, actual styling needs to be applied inline and not via
           * selectors, because we want them to propagate onto the webview,
           * which doesn't have access to <style> sheets in this document. */ }
        <webview-wrapper ref="webviewWrapper"
          preload={'../../content/preload/content.js'}
          class={`webview-${this.props.page.id}`}
          webviewinnerstyle={JSON.stringify(WEB_VIEW_INNER_STYLE)}
          webviewwrapperstyle={JSON.stringify(Object.assign({}, WEB_VIEW_WRAPPER_STYLE,
            this.props.page.chromeMode === 'expanded'
              ? WEB_VIEW_WRAPPER_CHROME_EXPANDED_STYLE
              : WEB_VIEW_WRAPPER_CHROME_COLLAPSED_STYLE))}
          guestInstanceId={this.props.page.guestInstanceId}
          onContextMenu={() => this.props.dispatch(contextMenu())} />
        <Status page={this.props.page} />
      </div>
    );
  }
}

Page.propTypes = {
  page: PropTypes.object.isRequired,
  isActive: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
  ipcRenderer: PropTypes.object.isRequired,
};

export default Page;

function addListenersToWebView(webview, page, dispatch, ipcRenderer) {
  webview.addEventListener('did-start-loading', () => {
    dispatch(setPageDetails(page.id, {
      isLoading: true,
      title: false,
    }));
  });

  webview.addEventListener('dom-ready', () => {
    dispatch(setPageDetails(page.id, {
      canGoBack: webview.canGoBack(),
      canGoForward: webview.canGoForward(),
      canRefresh: true,
    }));
  });

  webview.addEventListener('page-title-set', e => {
    dispatch(setPageDetails(page.id, {
      title: e.title,
      location: webview.getURL(),
    }));
  });

  webview.addEventListener('did-stop-loading', () => {
    const url = webview.getURL();
    dispatch(setPageDetails(page.id, {
      statusText: false,
      location: url,
      canGoBack: webview.canGoBack(),
      canGoForward: webview.canGoForward(),
      isLoading: false,
    }));
    dispatch(setUserTypedLocation(page.id, {
      text: null,
    }));

    ipcRenderer.send('profile-command', profileCommands.visited(url));
  });

  webview.addEventListener('ipc-message', e => {
    switch (e.channel) {
      case 'status':
        dispatch(setPageDetails(page.id, {
          statusText: e.args[0],
        }));
        break;
      case 'contextmenu-data':
        menuWebViewContext(e.args[0], dispatch);
        break;
      case 'show-bookmarks':
        console.warn('@TODO: ipc-message:show-bookmarks');
        break;
      case 'scroll': {
        const { y: scrollY } = e.args[0];
        const chromeMode = scrollY ? 'collapsed' : 'expanded';
        dispatch(setPageDetails(page.id, { chromeMode }));
        break;
      }
      default:
        console.warn(`@TODO: Unknown ipc-message:${e.channel}`);
        break;
    }
  });

  webview.addEventListener('destroyed', () => {
    dispatch(closeTab(page.id));
  });
}
