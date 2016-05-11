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
import { Page as PageModel } from '../../model';

import Status from './status';
import Search from './search';

import { fixURL } from '../../browser-util';
import { menuWebViewContext } from '../../actions/external';
import * as actions from '../../actions/main-actions';
import * as userAgent from '../../lib/user-agent';

const PAGE_STYLE = Style.registerStyle({
  // Mark this as the relative anchor for floating children (e.g. search bar).
  position: 'relative',
  flex: 1,

  // See the discussion about hiding <webview> elements at:
  // https://github.com/electron/electron/blob/master/docs/api/web-view-tag.md#css-styling-notes
  '&:not(.active-browser-page)': {
    flex: '0 1',
    width: '0px',
    height: '0px',
  },
});

const WEB_VIEW_STYLE = Style.registerStyle({
  display: 'flex',
  flex: 1,
});

class Page extends Component {
  componentDidMount() {
    const { webViewController, page, dispatch } = this.props;
    const { id } = page;
    const webview = this.refs.webview;

    addListenersToWebView(webview, () => this.props.page, dispatch);

    webViewController.on(`navigate-back:${id}`, () => webview.goBack());
    webViewController.on(`navigate-forward:${id}`, () => webview.goForward());
    webViewController.on(`navigate-refresh:${id}`, () => webview.reload());
    webViewController.on(`navigate-to:${id}`,
      (_, loc) => webview.setAttribute('src', fixURL(loc)));

    if (!page.guestInstanceId && page.location) {
      webview.setAttribute('src', fixURL(page.location));
    }
  }

  render() {
    const requestContextData = (event) => {
      const { offsetX: x, offsetY: y } = event.nativeEvent;
      this.refs.webview.send('get-contextmenu-data', { x, y });
    };

    return (
      <div className={`page ${PAGE_STYLE} ${this.props.isActive ? 'active-browser-page' : ''}`}
        data-page-state={this.props.page.state}>
        <Search hidden={!this.props.page.isSearching} />
        <webview is="webview"
          ref="webview"
          class={`webview-${this.props.page.id} ${WEB_VIEW_STYLE}`}
          preload={'../../content/preload/content.js'}
          guestInstanceId={this.props.page.guestInstanceId}
          onContextMenu={requestContextData} />
        <Status page={this.props.page} />
      </div>
    );
  }
}

Page.displayName = 'Page';

Page.propTypes = {
  page: PropTypes.object.isRequired,
  isActive: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
  webViewController: PropTypes.object.isRequired,
};

export default Page;

function addListenersToWebView(webview, pageAccessor, dispatch) {
  webview.addEventListener('did-start-loading', () => {
    dispatch(actions.setPageDetails(pageAccessor().id, {
      state: PageModel.PAGE_STATE_LOADING,
    }));
  });

  webview.addEventListener('dom-ready', () => {
    dispatch(actions.setPageDetails(pageAccessor().id, {
      canGoBack: webview.canGoBack(),
      canGoForward: webview.canGoForward(),
      canRefresh: true,
    }));
  });

  webview.addEventListener('page-title-set', e => {
    dispatch(actions.setPageDetails(pageAccessor().id, {
      title: e.title,
      location: webview.getURL(),
    }));
  });

  webview.addEventListener('did-fail-load', () => {
    dispatch(actions.setPageDetails(pageAccessor().id, {
      state: PageModel.PAGE_STATE_FAILED,
    }));
  });

  webview.addEventListener('did-stop-loading', () => {
    const url = webview.getURL();
    const title = webview.getTitle();

    dispatch(actions.setPageDetails(pageAccessor().id, {
      location: url,
      canGoBack: webview.canGoBack(),
      canGoForward: webview.canGoForward(),
      state: PageModel.PAGE_STATE_LOADED,
      title,
    }));

    dispatch(actions.setStatusText(false));

    dispatch(actions.setUserTypedLocation(pageAccessor().id, {
      text: null,
    }));

    userAgent.createHistory({ url, title, session: pageAccessor().sessionId });
  });

  webview.addEventListener('ipc-message', e => {
    switch (e.channel) {
      case 'status':
        dispatch(actions.setStatusText(e.args[0]));
        break;
      case 'contextmenu-data':
        menuWebViewContext(webview, e.args[0], dispatch, pageAccessor().sessionId);
        break;
      case 'show-bookmarks':
        console.warn('@TODO: ipc-message:show-bookmarks');
        break;
      default:
        console.warn(`@TODO: Unknown ipc-message:${e.channel}`);
        break;
    }
  });

  webview.addEventListener('destroyed', () => {
    dispatch(actions.closeTab(pageAccessor().id));
  });
}
