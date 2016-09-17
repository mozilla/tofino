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
import DropdownMenuBtn from '../../../../shared/widgets/dropdown-menu-btn';
import HistoryListItem from './history-list-item';

import * as SharedPropTypes from '../../../model/shared-prop-types';
import * as PagesSelectors from '../../../selectors/pages';

const NAVIGATION_BUTTONS_CONTAINER_STYLE = Style.registerStyle({
  alignItems: 'center',
  marginLeft: '7px',
  marginRight: '1px',
});

const BACK_BUTTON_STYLE = Style.registerStyle({
  backgroundColor: 'var(--theme-navbar-back-button-background)',
  border: '6px solid var(--theme-navbar-back-button-background)',
  borderRadius: '50%',
  boxShadow: '0 0 0 1px var(--theme-navbar-back-button-border-color)',
});

const FORWARD_BUTTON_STYLE = Style.registerStyle({
  marginLeft: '4px',
  marginRight: '2px',
});

class NavigationButtons extends Component {
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

  handleHistoryPick = ({ index }) => {
    this.props.onNavigateInHistory(this.props.pageId, index);
  }

  render() {
    return (
      <div className={`browser-navigation ${NAVIGATION_BUTTONS_CONTAINER_STYLE}`}>
        <DropdownMenuBtn className={`browser-navbar-back ${BACK_BUTTON_STYLE}`}
          title="Back"
          width="18px"
          height="18px"
          image="toolbar.png"
          imgWidth="792px"
          imgHeight="72px"
          imgPosition="-19px 0px"
          imgPositionHover="-19px -18px"
          disabled={!this.props.pageCanGoBack}
          onClick={this.handleNavigateBackClick}
          onMenuItemPick={this.handleHistoryPick}
          dataSrc={this.props.pageHistory}
          childComponent={HistoryListItem}
          reverseDropdownMenu />
        <DropdownMenuBtn className={`browser-navbar-forward ${FORWARD_BUTTON_STYLE}`}
          title="Forward"
          width="18px"
          height="18px"
          image="toolbar.png"
          imgWidth="792px"
          imgHeight="72px"
          imgPosition="-55px 0px"
          imgPositionHover="-55px -18px"
          disabled={!this.props.pageCanGoForward}
          onClick={this.handleNavigateForwardClick}
          onMenuItemPick={this.handleHistoryPick}
          dataSrc={this.props.pageHistory}
          childComponent={HistoryListItem}
          reverseDropdownMenu />
      </div>
    );
  }
}

NavigationButtons.displayName = 'NavigationButtons';

NavigationButtons.propTypes = {
  pageId: PropTypes.string.isRequired,
  pageCanGoBack: PropTypes.bool.isRequired,
  pageCanGoForward: PropTypes.bool.isRequired,
  pageHistory: SharedPropTypes.PageLocalHistoryItems.isRequired,
  onNavigateBack: PropTypes.func.isRequired,
  onNavigateForward: PropTypes.func.isRequired,
  onNavigateInHistory: PropTypes.func.isRequired,
};

function mapStateToProps(state, ownProps) {
  const page = PagesSelectors.getPageById(state, ownProps.pageId);
  return {
    pageCanGoBack: page ? PagesSelectors.getPageCanGoBack(state, ownProps.pageId) : false,
    pageCanGoForward: page ? PagesSelectors.getPageCanGoForward(state, ownProps.pageId) : false,
    pageHistory: page ? page.history : null,
  };
}

export default connect(mapStateToProps)(NavigationButtons);
