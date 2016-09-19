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
import Location from '../location';
import NavigationButtons from './navigation-buttons';
import ToolbarButtons from './toolbar-buttons';

import * as ContentURLs from '../../../../../shared/constants/content-pages-locations';
import * as UIConstants from '../../../constants/ui';
import * as UIActions from '../../../actions/ui-actions';
import * as UISelectors from '../../../selectors/ui';
import * as ExternalEffects from '../../../actions/external-effects';

const NAVBAR_STYLE = Style.registerStyle({
  alignItems: 'center',
  boxSizing: 'border-box',
  height: `${UIConstants.NAVBAR_HEIGHT}px`,
  boxShadow: 'inset 0 -1px 0px 0px var(--theme-navbar-border-bottom-color)',
  background: 'var(--theme-navbar-background)',
});

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
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

  handleBookmarksButtonClick = () => {
    this.props.onNavigateTo(this.props.pageId, ContentURLs.STARS_PAGE);
  }

  handleHomeButtonClick = () => {
    this.props.onNavigateTo(this.props.pageId, UIConstants.HOME_PAGE);
  }

  handleAppMenuClick = () => {
    this.props.dispatch(ExternalEffects.openAppMenu());
  }

  render() {
    return (
      <div id={`browser-navbar-${this.props.pageId}`}
        className={`browser-navbar ${NAVBAR_STYLE}`}>
        <NavigationButtons pageId={this.props.pageId}
          onNavigateBack={this.props.onNavigateBack}
          onNavigateForward={this.props.onNavigateForward}
          onNavigateInHistory={this.props.onNavigateInHistory} />
        <Location pageId={this.props.pageId}
          onNavigateTo={this.props.onNavigateTo}
          onNavigateRefresh={this.props.onNavigateRefresh} />
        <ToolbarButtons pageId={this.props.pageId}
          onNavigateTo={this.props.onNavigateTo} />
      </div>
    );
  }
}

NavBar.displayName = 'NavBar';

NavBar.propTypes = {
  dispatch: PropTypes.func.isRequired,
  pageId: PropTypes.string.isRequired,
  onNavigateBack: PropTypes.func.isRequired,
  onNavigateForward: PropTypes.func.isRequired,
  onNavigateRefresh: PropTypes.func.isRequired,
  onNavigateTo: PropTypes.func.isRequired,
  onNavigateInHistory: PropTypes.func.isRequired,
};

export default connect()(NavBar);
