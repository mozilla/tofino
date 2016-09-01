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

import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import { logger } from '../../../../../shared/logging';

import Style from '../../../../shared/style';
import * as UIActions from '../../../actions/ui';
import * as PageActions from '../../../actions/page';
import * as PagesSelectors from '../../../selectors/pages';

const PAGE_STYLE = Style.registerStyle({
  flex: 1,
});

const WEB_VIEW_STYLE = Style.registerStyle({
  display: 'flex',
  flex: 1,
});

class Page extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  componentDidMount() {
    this.addWebviewListeners();
    this.props.onMount(this.props.pageId, this.props.pageLocation);
  }

  addWebviewListeners() {
    this.webview.addEventListener('page-title-set', e => {
      this.props.dispatch(PageActions.setPageDetails(this.props.pageId, {
        title: e.title,
        location: this.webview.getURL(),
      }));
    });

    this.webview.addEventListener('dom-ready', () => {
      this.props.dispatch(PageActions.setPageDetails(this.props.pageId, {
        canGoBack: this.webview.canGoBack(),
        canGoForward: this.webview.canGoForward(),
        canRefresh: true,
      }));
    });

    this.webview.addEventListener('ipc-message', e => {
      switch (e.channel) {
        case 'status':
          this.props.dispatch(UIActions.setStatusText(e.args[0]));
          break;
        case 'contextmenu-data':
          // TODO
          break;
        case 'show-bookmarks':
          // TODO
          break;
        case 'metadata':
          this.props.dispatch(PageActions.setPageDetails(this.props.pageId, {
            meta: e.args[0],
          }));
          break;
        default:
          logger.warn(`@TODO: Unknown ipc-message:${e.channel}`);
          break;
      }
    });
  }

  render() {
    return (
      <div id={`browser-page-${this.props.pageId}`}
        className={`browser-page ${PAGE_STYLE}`}
        data-is-active={this.props.isActive}>
        <webview is="webview"
          ref={element => this.webview = element}
          class={WEB_VIEW_STYLE}
          preload="../preload/index.js" />
      </div>
    );
  }
}

Page.displayName = 'Page';

Page.propTypes = {
  dispatch: PropTypes.func.isRequired,
  pageId: PropTypes.string.isRequired,
  pageLocation: PropTypes.string.isRequired,
  onMount: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired,
};

function mapStateToProps(state, ownProps) {
  return {
    isActive: PagesSelectors.getSelectedPageId(state) === ownProps.pageId,
  };
}

export default connect(mapStateToProps)(Page);
