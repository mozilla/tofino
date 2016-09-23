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
import SecurityBadge from './security-badge';
import AutocompletedSearch from '../../../../shared/widgets/autocompleted-search';
import AutocompletionListItem from './autocompletion-list-item';

import { NAVBAR_HEIGHT, TABBAR_HEIGHT } from '../../../constants/ui';
import * as SharedPropTypes from '../../../model/shared-prop-types';
import * as LocationUtil from '../../../../shared/util/location-util';
import * as UISelectors from '../../../selectors/ui';
import * as PagesSelectors from '../../../selectors/pages';
import * as ProfileSelectors from '../../../selectors/profile';
import * as ProfileEffects from '../../../actions/profile-effects';
import * as PageEffects from '../../../actions/page-effects';

const LOCATION_BAR_STYLE = Style.registerStyle({
  flex: 1,
  alignSelf: 'stretch',
  alignItems: 'center',
  margin: '8px 0px',
  padding: '0 5px',
  borderRadius: 'var(--theme-default-roundness)',
  boxShadow: 'var(--theme-locationbar-box-shadow)',
  backgroundColor: 'var(--theme-content-background)',
});

const LOCATION_BAR_INPUT_STYLE = Style.registerStyle({
  flex: 1,
  alignSelf: 'stretch',
  padding: '0 1px',
  fontSize: '110%',
});

const DROPDOWN_LIST_STYLE = Style.registerStyle({
  maxHeight: `calc(100vh - ${NAVBAR_HEIGHT}px - ${TABBAR_HEIGHT}px)`,
});

const LOCATION_BAR_SECURITY_BADGE_STYLE = Style.registerStyle({
  paddingLeft: '2px',
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

  handleInputChange = e => {
    const pageId = this.props.pageId;
    const text = e.target.value;
    this.props.dispatch(ProfileEffects.fetchLocationAutocompletions(pageId, text));
  }

  handleInputKeyDown = e => {
    if (e.key === 'Enter') {
      this.handleAutocompletionPick({ uri: e.target.value });
    }
  }

  handleAutocompletionPick = ({ data }) => {
    const location = LocationUtil.fixURL(data.uri);
    this.props.dispatch(PageEffects.navigatePageTo(this.props.pageId, location));
  }

  handleInfoButtonClick = () => {
    // TODO
  }

  handleConnectionButtonClick= () => {
    // TODO
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
      <div className={`browser-location ${LOCATION_BAR_STYLE}`}>
        <Btn title="Info"
          image="identity-icon.svg#normal"
          imageHover="identity-icon.svg#hover"
          imgWidth="16px"
          imgHeight="16px"
          onClick={this.handleInfoButtonClick} />
        <SecurityBadge title="Connection"
          className={LOCATION_BAR_SECURITY_BADGE_STYLE}
          imgWidth="16px"
          imgHeight="16px"
          url={this.props.pageLocation}
          pageState={this.props.pageState}
          onClick={this.handleConnectionButtonClick} />
        <VerticalSeparator className={SEPARATOR_STYLE} />
        <AutocompletedSearch ref={e => this.awesomebar = e}
          className={LOCATION_BAR_INPUT_STYLE}
          defaultValue={this.props.pageLocation}
          onChange={this.handleInputChange}
          onKeyDown={this.handleInputKeyDown}
          onAutocompletionPick={this.handleAutocompletionPick}
          dataSrc={this.props.locationAutocompletions}
          childComponent={AutocompletionListItem}
          dropdownListClassName={DROPDOWN_LIST_STYLE} />
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
  pageLocation: PropTypes.string.isRequired,
  pageCanRefresh: PropTypes.bool.isRequired,
  pageIsBookmarked: PropTypes.bool.isRequired,
  pageState: SharedPropTypes.PageState,
  locationAutocompletions: SharedPropTypes.LocationAutocompletions,
};

function mapStateToProps(state, ownProps) {
  const page = PagesSelectors.getPageById(state, ownProps.pageId);
  return {
    pageLocation: page ? page.location : '',
    pageState: PagesSelectors.getPageState(state, ownProps.pageId),
    pageCanRefresh: page ? PagesSelectors.getPageCanRefresh(state, ownProps.pageId) : false,
    pageIsBookmarked: page ? ProfileSelectors.isBookmarked(state, page.location) : false,
    locationAutocompletions: page ? UISelectors.getLocationAutocompletions(state, page.id) : null,
  };
}

export default connect(mapStateToProps)(Location);
