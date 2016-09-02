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

import Style from '../../../../shared/style';
import Btn from '../../../../shared/widgets/btn';
import Location from '../location';

import * as UIConstants from '../../../constants/ui';
import * as UISelectors from '../../../selectors/ui';
import * as UIActions from '../../../actions/ui';
import * as ExternalActions from '../../../actions/external';

const NAVBAR_STYLE = Style.registerStyle({
  height: `${UIConstants.NAVBAR_HEIGHT}px`,
  backgroundColor: 'var(--theme-navbar-background)',
});

const NAVIGATION_BUTTONS_STYLE = Style.registerStyle({
  margin: '0 10px',
});

const TOOLBAR_BUTTONS_STYLE = Style.registerStyle({
  margin: '0 10px',
});

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  handleNavigateBackClick = () => {
    this.props.onNavigateBack(this.props.pageId);
  }

  handleNavigateForwardClick = () => {
    this.props.onNavigateForward(this.props.pageId);
  }

  handleNavigateRefreshClick = () => {
    this.props.onNavigateRefresh(this.props.pageId);
  }

  handleNavigateTo = location => {
    this.props.onNavigateTo(this.props.pageId, location);
  }

  handleOverviewButtonClick = () => {
    if (this.props.isOverviewVisible) {
      this.props.dispatch(UIActions.hideOverview());
    } else {
      this.props.dispatch(UIActions.showOverview());
    }
  }

  render() {
    return (
      <div className={`browser-navbar ${NAVBAR_STYLE}`}>
        <Btn className={`browser-navbar-back ${NAVIGATION_BUTTONS_STYLE}`}
          title="Back"
          image="glyph-arrow-nav-back.svg"
          imgWidth="18px"
          imgHeight="18px"
          onClick={this.handleNavigateBackClick}
          disabled={!this.props.pageCanGoBack} />
        <Btn className={`browser-navbar-forward ${NAVIGATION_BUTTONS_STYLE}`}
          title="Forward"
          image="glyph-arrow-nav-forward.svg"
          imgWidth="18px"
          imgHeight="18px"
          onClick={this.handleNavigateForwardClick}
          disabled={!this.props.pageCanGoForward} />
        <Btn className={`browser-navbar-refresh ${NAVIGATION_BUTTONS_STYLE}`}
          title="Refresh"
          imgWidth="18px"
          imgHeight="18px"
          image="glyph-arrow-reload.svg"
          onClick={this.handleNavigateRefreshClick}
          disabled={!this.props.pageCanRefresh} />
        <Location textContent={this.props.pageLocation}
          onNavigate={this.handleNavigateTo} />
        <Btn className={`overview-button ${TOOLBAR_BUTTONS_STYLE}`}
          title="Menu"
          image="glyph-overview.svg"
          imgWidth="18px"
          imgHeight="18px"
          onClick={this.handleOverviewButtonClick} />
        <Btn className={`browser-menu-button ${TOOLBAR_BUTTONS_STYLE}`}
          title="Menu"
          image="glyph-menu.svg"
          imgWidth="18px"
          imgHeight="18px"
          onClick={ExternalActions.openAppMenu} />
      </div>
    );
  }
}

NavBar.displayName = 'NavBar';

NavBar.propTypes = {
  dispatch: PropTypes.func.isRequired,
  pageId: PropTypes.string.isRequired,
  pageLocation: PropTypes.string.isRequired,
  pageCanGoBack: PropTypes.bool.isRequired,
  pageCanGoForward: PropTypes.bool.isRequired,
  pageCanRefresh: PropTypes.bool.isRequired,
  onNavigateBack: PropTypes.func.isRequired,
  onNavigateForward: PropTypes.func.isRequired,
  onNavigateRefresh: PropTypes.func.isRequired,
  onNavigateTo: PropTypes.func.isRequired,
  isOverviewVisible: PropTypes.bool.isRequired,
};

function mapStateToProps(state) {
  return {
    isOverviewVisible: UISelectors.getOverviewVisible(state),
  };
}

export default connect(mapStateToProps)(NavBar);
