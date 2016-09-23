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
import VerticalSeparator from '../../../../shared/widgets/vertical-separator';

import * as ContentURLs from '../../../../../shared/constants/content-pages-locations';
import * as UIConstants from '../../../constants/ui';
import * as UIActions from '../../../actions/ui-actions';
import * as UISelectors from '../../../selectors/ui';
import * as ExternalEffects from '../../../actions/external-effects';
import * as PageEffects from '../../../actions/page-effects';

const TOOLBAR_BUTTONS_CONTAINER_STYLE = Style.registerStyle({
  alignSelf: 'stretch',
  alignItems: 'center',
  marginLeft: '12px',
  marginRight: '12px',
});

const BUTTONS_SECTION = Style.registerStyle({
  alignItems: 'center',
});

const TOOLBAR_BUTTONS_STYLE = Style.registerStyle({
  '&:not(:last-child)': {
    marginRight: '12px',
  },
});

const APP_MENU_BUTTON_STYLE = Style.registerStyle({
  margin: 0,
});

const SEPARATOR_STYLE = Style.registerStyle({
  margin: '3px 12px',
});

class ToolbarButtons extends Component {
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
    this.props.dispatch(PageEffects.navigatePageTo(this.props.pageId, ContentURLs.STARS_PAGE));
  }

  handleHistoryButtonClick = () => {
    this.props.dispatch(PageEffects.navigatePageTo(this.props.pageId, ContentURLs.HISTORY_PAGE));
  }

  handleHomeButtonClick = () => {
    this.props.dispatch(PageEffects.navigatePageTo(this.props.pageId, UIConstants.HOME_PAGE));
  }

  handleAppMenuClick = () => {
    this.props.dispatch(ExternalEffects.openAppMenu());
  }

  render() {
    return (
      <div className={`browser-toolbar ${TOOLBAR_BUTTONS_CONTAINER_STYLE}`}>
        <div className={`browser-toolbar-buttons-section ${BUTTONS_SECTION}`}>
          <Btn className={`browser-bookmarks-button ${TOOLBAR_BUTTONS_STYLE}`}
            title="Bookmarks"
            width="18px"
            height="18px"
            image="toolbar.png"
            imgWidth="792px"
            imgHeight="72px"
            imgPosition="-612px 0px"
            imgPositionHover="-612px -18px"
            onClick={this.handleBookmarksButtonClick} />
          <Btn className={`browser-history-button ${TOOLBAR_BUTTONS_STYLE}`}
            title="History"
            width="18px"
            height="18px"
            image="toolbar.png"
            imgWidth="792px"
            imgHeight="72px"
            imgPosition="-162px 0px"
            imgPositionHover="-162px -18px"
            onClick={this.handleHistoryButtonClick} />
          <Btn className={`browser-overview-button ${TOOLBAR_BUTTONS_STYLE}`}
            title="Overview"
            width="18px"
            height="18px"
            image="toolbar.png"
            imgWidth="792px"
            imgHeight="72px"
            imgPosition="-630px 0px"
            imgPositionHover="-630px -18px"
            onClick={this.handleOverviewButtonClick} />
          <Btn className={`browser-home-button ${TOOLBAR_BUTTONS_STYLE}`}
            title="Home"
            width="18px"
            height="18px"
            image="toolbar.png"
            imgWidth="792px"
            imgHeight="72px"
            imgPosition="-108px 0px"
            imgPositionHover="-108px -18px"
            onClick={this.handleHomeButtonClick} />
        </div>
        <VerticalSeparator className={SEPARATOR_STYLE} />
        <div className={`browser-toolbar-buttons-section ${BUTTONS_SECTION}`}>
          <Btn className={`browser-menu-button ${TOOLBAR_BUTTONS_STYLE} ${APP_MENU_BUTTON_STYLE}`}
            title="Menu"
            width="18px"
            height="18px"
            image="toolbar.png"
            imgWidth="792px"
            imgHeight="72px"
            imgPosition="-468px 0px"
            imgPositionHover="-468px -18px"
            onClick={this.handleAppMenuClick} />
        </div>
      </div>
    );
  }
}

ToolbarButtons.displayName = 'ToolbarButtons';

ToolbarButtons.propTypes = {
  dispatch: PropTypes.func.isRequired,
  pageId: PropTypes.string.isRequired,
};

export default connect()(ToolbarButtons);
