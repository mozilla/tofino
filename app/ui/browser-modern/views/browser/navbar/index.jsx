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
import DropdownMenuBtn from '../../../../shared/widgets/dropdown-menu-btn';
import HistoryListItem from './history-list-item';

import * as SharedPropTypes from '../../../model/shared-prop-types';
import * as UIConstants from '../../../constants/ui';
import * as UIActions from '../../../actions/ui-actions';
import * as UISelectors from '../../../selectors/ui';
import * as PagesSelectors from '../../../selectors/pages';
import * as ExternalEffects from '../../../actions/external-effects';

const NAVBAR_STYLE = Style.registerStyle({
  height: `${UIConstants.NAVBAR_HEIGHT}px`,
  backgroundColor: 'var(--theme-navbar-background)',
  borderBottom: '1px solid var(--theme-navbar-background)',
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

  handleHistoryPick = ({ index }) => {
    this.props.onNavigateInHistory(this.props.pageId, index);
  }

  handleOverviewButtonClick = () => {
    this.props.dispatch((dispatch, getState) => {
      const isOverviewVisible = UISelectors.getOverviewVisible(getState());
      if (isOverviewVisible) {
        dispatch(UIActions.hideOverview());
      } else {
        dispatch(UIActions.showOverview());
      }
    });
  }

  handleAppMenuClick = () => {
    this.props.dispatch(ExternalEffects.openAppMenu());
  }

  render() {
    return (
      <div id={`browser-navbar-${this.props.pageId}`}
        className={`browser-navbar ${NAVBAR_STYLE}`}>
        <DropdownMenuBtn className={`browser-navbar-back ${NAVIGATION_BUTTONS_STYLE}`}
          title="Back"
          image="glyph-arrow-nav-back.svg"
          imgWidth="18px"
          imgHeight="18px"
          disabled={!this.props.pageCanGoBack}
          onClick={this.handleNavigateBackClick}
          onMenuItemPick={this.handleHistoryPick}
          dataSrc={this.props.pageHistory}
          childComponent={HistoryListItem}
          reverseDropdownMenu />
        <DropdownMenuBtn className={`browser-navbar-forward ${NAVIGATION_BUTTONS_STYLE}`}
          title="Forward"
          image="glyph-arrow-nav-forward.svg"
          imgWidth="18px"
          imgHeight="18px"
          disabled={!this.props.pageCanGoForward}
          onClick={this.handleNavigateForwardClick}
          onMenuItemPick={this.handleHistoryPick}
          dataSrc={this.props.pageHistory}
          childComponent={HistoryListItem}
          reverseDropdownMenu />
        <Btn className={`browser-navbar-refresh ${NAVIGATION_BUTTONS_STYLE}`}
          title="Refresh"
          imgWidth="18px"
          imgHeight="18px"
          image="glyph-arrow-reload.svg"
          disabled={!this.props.pageCanRefresh}
          onClick={this.handleNavigateRefreshClick} />
        <Location pageId={this.props.pageId}
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
          onClick={this.handleAppMenuClick} />
      </div>
    );
  }
}

NavBar.displayName = 'NavBar';

NavBar.propTypes = {
  dispatch: PropTypes.func.isRequired,
  pageId: PropTypes.string.isRequired,
  pageCanGoBack: PropTypes.bool.isRequired,
  pageCanGoForward: PropTypes.bool.isRequired,
  pageCanRefresh: PropTypes.bool.isRequired,
  pageHistory: SharedPropTypes.PageLocalHistoryItems.isRequired,
  onNavigateBack: PropTypes.func.isRequired,
  onNavigateForward: PropTypes.func.isRequired,
  onNavigateRefresh: PropTypes.func.isRequired,
  onNavigateTo: PropTypes.func.isRequired,
  onNavigateInHistory: PropTypes.func.isRequired,
};

function mapStateToProps(state, ownProps) {
  const page = PagesSelectors.getPageById(state, ownProps.pageId);
  return {
    pageCanGoBack: page ? page.state.canGoBack : false,
    pageCanGoForward: page ? page.state.canGoForward : false,
    pageCanRefresh: page ? page.state.canRefresh : false,
    pageHistory: page ? page.history : null,
  };
}

export default connect(mapStateToProps)(NavBar);
