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

import * as PagesSelectors from '../../../selectors/pages';
import * as ProfileSelectors from '../../../selectors/profile';
import * as ProfileEffects from '../../../actions/profile-effects';
import * as PageEffects from '../../../actions/page-effects';

const LOCATION_BAR_BUTTONS_STYLE = Style.registerStyle({
  alignItems: 'center',
});

const LOCATION_BAR_REFRESH_BUTTON_STYLE = Style.registerStyle({
  padding: '2px',
});

const SEPARATOR_STYLE = Style.registerStyle({
  margin: '4px',
});

class Location extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  handleBookmarkButtonClick = () => {
    const pageId = this.props.pageId;
    const bookmarked = this.props.pageIsBookmarked;
    this.props.dispatch(ProfileEffects.setRemoteBookmarkState(pageId, !bookmarked));
  }

  handleRefreshButtonClick = () => {
    this.props.dispatch(PageEffects.navigatePageRefresh(this.props.pageId));
  }

  render() {
    return (
      <div className={`browser-location-buttons ${LOCATION_BAR_BUTTONS_STYLE}`}>
        <Btn title="Bookmark"
          width="18px"
          height="18px"
          image="toolbar.png"
          imgWidth="792px"
          imgHeight="72px"
          imgPosition={`${this.props.pageIsBookmarked ? '-144px' : '-126px'} 0px`}
          imgPositionHover={`${this.props.pageIsBookmarked ? '-144px' : '-126px'} -18px`}
          onClick={this.handleBookmarkButtonClick} />
        <VerticalSeparator className={SEPARATOR_STYLE} />
        <Btn title="Refresh"
          className={LOCATION_BAR_REFRESH_BUTTON_STYLE}
          width="14px"
          height="14px"
          image="reload-stop-go.png"
          imgWidth="42px"
          imgHeight="28px"
          imgPosition="0px 0px"
          imgPositionActive="0px -14px"
          disabled={!this.props.pageCanRefresh}
          onClick={this.handleRefreshButtonClick} />
      </div>
    );
  }
}

Location.displayName = 'Location';

Location.propTypes = {
  dispatch: PropTypes.func.isRequired,
  pageId: PropTypes.string.isRequired,
  pageIsBookmarked: PropTypes.bool.isRequired,
  pageCanRefresh: PropTypes.bool.isRequired,
};

function mapStateToProps(state, ownProps) {
  const page = PagesSelectors.getPageById(state, ownProps.pageId);
  return {
    pageIsBookmarked: ProfileSelectors.isBookmarked(state, page.location),
    pageCanRefresh: PagesSelectors.getPageCanRefresh(state, ownProps.pageId),
  };
}

export default connect(mapStateToProps)(Location);
