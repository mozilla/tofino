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

import Style from '../../../shared/style';
import NavBar from './navbar';
import Page from './page';

import * as SharedPropTypes from '../../model/shared-prop-types';
import * as UIConstants from '../../constants/ui';
import * as UISelectors from '../../selectors/ui';
import * as PagesSelectors from '../../selectors/pages';

const CONTENT_AREA_STYLE = Style.registerStyle({
  flex: 1,
  zIndex: UIConstants.BROWSER_CONTENT_BASE_ZINDEX,
  '&[data-overview-visible=true]': {
    display: 'none',
  },
});

const PAGE_CONTAINER_STYLE = Style.registerStyle({
  flex: 1,
  flexDirection: 'column',
  '&[data-active-page=false]': {
    display: 'none',
  },
});

class ContentArea extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {
    return (
      <div id="browser-content"
        className={CONTENT_AREA_STYLE}
        data-overview-visible={this.props.isOverviewVisible}>
        {this.props.pages.map(page => (
          <div key={`page-container-${page.id}`}
            className={PAGE_CONTAINER_STYLE}
            data-active-page={page.id === this.props.selectedPageId}>
            <NavBar pageId={page.id}
              pageLocation={page.location}
              pageCanGoBack={page.canGoBack}
              pageCanGoForward={page.canGoForward}
              pageCanRefresh={page.canRefresh}
              onNavigateBack={this.props.onNavigateBack}
              onNavigateForward={this.props.onNavigateForward}
              onNavigateRefresh={this.props.onNavigateRefresh}
              onNavigateTo={this.props.onNavigateTo} />
            <Page pageId={page.id}
              pageLocation={page.location}
              onMount={this.props.onPageMount} />
          </div>
        ))}
      </div>
    );
  }
}

ContentArea.displayName = 'ContentArea';

ContentArea.propTypes = {
  onPageMount: PropTypes.func.isRequired,
  onNavigateBack: PropTypes.func.isRequired,
  onNavigateForward: PropTypes.func.isRequired,
  onNavigateRefresh: PropTypes.func.isRequired,
  onNavigateTo: PropTypes.func.isRequired,
  pages: SharedPropTypes.Pages.isRequired,
  selectedPageId: PropTypes.string.isRequired,
  isOverviewVisible: PropTypes.bool.isRequired,
};

function mapStateToProps(state) {
  return {
    pages: PagesSelectors.getPages(state),
    selectedPageId: PagesSelectors.getSelectedPageId(state),
    isOverviewVisible: UISelectors.getOverviewVisible(state),
  };
}

export default connect(mapStateToProps)(ContentArea);
