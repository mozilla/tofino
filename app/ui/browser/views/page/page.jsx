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
import { Page as PageModel } from '../../model';

import Status from './status';
import Search from './search';

import { fixURL } from '../../browser-util';
import { menuWebViewContext } from '../../actions/external';
import {
  closeTab,
  setPageDetails,
  setStatusText,
  setUserTypedLocation,
} from '../../actions/main-actions';
import * as profileCommands from '../../../../shared/profile-commands';

const PAGE_STYLE = Style.registerStyle({
  // Hide the overflow for pages because when applying a `translateY` to the webview element,
  // a scrollbar appears for the browser window, due to shifting everything vertically.
  overflow: 'hidden',

  // Mark this as the relative anchor for floating children (e.g. search bar).
  position: 'relative',
  flex: 1,
});

const WEB_VIEW_STYLE = Style.registerStyle({
  display: 'flex',
  flex: 1,
  transition: 'transform 0.3s ease-in-out',
});

const WEB_VIEW_CHROME_EXPANDED_STYLE = Style.registerStyle({
  transform: `translateY(${UIConstants.NAVBAR_EXPANDED_HEIGHT + UIConstants.TABBAR_HEIGHT}px)`,
});

const WEB_VIEW_CHROME_COLLAPSED_STYLE = Style.registerStyle({
  transform: `translateY(${UIConstants.TABBAR_HEIGHT}px)`,
});

class Page extends Component {
  componentDidMount() {
    const { page, dispatch } = this.props;
    const webview = this.refs.webview;

    addListenersToWebView(webview, () => this.props.page, dispatch);

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
    const webview = this.refs.webview;
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
    const requestContextData = (event) => {
      const { offsetX: x, offsetY: y } = event.nativeEvent;
      this.refs.webview.send('get-contextmenu-data', { x, y });
    };

    return (
      <div className={`page ${PAGE_STYLE} ${this.props.isActive ? 'active-browser-page' : ''}`}
        data-page-state={this.props.page.state}
        hidden={!this.props.isActive}>
        <Search hidden={!this.props.page.isSearching} />
        <webview is="webview"
          ref="webview"
          class={`webview-${this.props.page.id} ${WEB_VIEW_STYLE}
            ${this.props.page.chromeMode === 'expanded'
              ? WEB_VIEW_CHROME_EXPANDED_STYLE
              : WEB_VIEW_CHROME_COLLAPSED_STYLE}`}
          preload={'../../content/preload/content.js'}
          guestInstanceId={this.props.page.guestInstanceId}
          onContextMenu={requestContextData} />
        <Status page={this.props.page} />
      </div>
    );
  }
}

Page.propTypes = {
  page: PropTypes.object.isRequired,
  isActive: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default Page;

function addListenersToWebView(webview, pageAccessor, dispatch) {
  webview.addEventListener('did-start-loading', () => {
    dispatch(setPageDetails(pageAccessor().id, {
      state: PageModel.PAGE_STATE_LOADING,
    }));
  });

  webview.addEventListener('dom-ready', () => {
    dispatch(setPageDetails(pageAccessor().id, {
      canGoBack: webview.canGoBack(),
      canGoForward: webview.canGoForward(),
      canRefresh: true,
    }));
  });

  webview.addEventListener('page-title-set', e => {
    dispatch(setPageDetails(pageAccessor().id, {
      title: e.title,
      location: webview.getURL(),
    }));
  });

  webview.addEventListener('did-fail-load', () => {
    dispatch(setPageDetails(pageAccessor().id, {
      state: PageModel.PAGE_STATE_FAILED,
    }));
  });

  webview.addEventListener('did-stop-loading', () => {
    const url = webview.getURL();
    const title = webview.getTitle();

    dispatch(setPageDetails(pageAccessor().id, {
      location: url,
      canGoBack: webview.canGoBack(),
      canGoForward: webview.canGoForward(),
      state: PageModel.PAGE_STATE_LOADED,
      title,
    }));

    dispatch(setStatusText(false));

    dispatch(setUserTypedLocation(pageAccessor().id, {
      text: null,
    }));

    const sessionId = pageAccessor().sessionId;
    if (sessionId) {
      profileCommands.send(profileCommands.visited(sessionId, url, title));
    }
  });

  webview.addEventListener('ipc-message', e => {
    switch (e.channel) {
      case 'status':
        dispatch(setStatusText(e.args[0]));
        break;
      case 'contextmenu-data':
        menuWebViewContext(webview, e.args[0], dispatch, pageAccessor().sessionId);
        break;
      case 'show-bookmarks':
        console.warn('@TODO: ipc-message:show-bookmarks');
        break;
      case 'scroll': {
        const { y: scrollY } = e.args[0];
        const chromeMode = scrollY ? 'collapsed' : 'expanded';
        dispatch(setPageDetails(pageAccessor().id, { chromeMode }));
        break;
      }
      default:
        console.warn(`@TODO: Unknown ipc-message:${e.channel}`);
        break;
    }
  });

  webview.addEventListener('destroyed', () => {
    dispatch(closeTab(pageAccessor().id));
  });
}
