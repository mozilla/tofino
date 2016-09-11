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
import AutocompletedSearch from '../../../../shared/widgets/autocompleted-search';
import AutocompletionListItem from './autocompletion-list-item';

import * as SharedPropTypes from '../../../model/shared-prop-types';
import * as LocationUtil from '../../../../shared/util/location-util';
import * as UISelectors from '../../../selectors/ui';
import * as PagesSelectors from '../../../selectors/pages';
import * as ProfileSelectors from '../../../selectors/profile';
import * as ProfileEffects from '../../../actions/profile-effects';

const LOCATION_BAR_STYLE = Style.registerStyle({
  flex: 1,
  alignItems: 'center',
  backgroundColor: 'var(--theme-content-background)',
});

const LOCATION_BAR_INPUT_STYLE = Style.registerStyle({
  flex: 1,
});

const LOCATION_BAR_BUTTONS_STYLE = Style.registerStyle({
  margin: '0 10px',
});

class Location extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  getInfoButtonIcon() {
    // The only state we have currently for this is the search icon --
    // fall back to default, but in the future we can have SSL/favicon
    // icons, etc.
    return '';
  }

  getBookmarkIcon() {
    if (this.props.pageIsBookmarked) {
      return 'glyph-bookmark-filled-black.svg';
    }
    return 'glyph-bookmark-hollow-black.svg';
  }

  handleInputChange = e => {
    const pageId = this.props.pageId;
    const text = e.target.value;
    this.props.dispatch(ProfileEffects.fetchLocationAutocompletions(pageId, text));
  }

  handleInputKeyDown = e => {
    if (e.key === 'Enter') {
      this.handleAutocompletionSelect({ uri: e.target.value });
    }
  }

  handleAutocompletionSelect = data => {
    this.props.onNavigate(LocationUtil.fixURL(data.uri));
  }

  handleInfoButtonClick = () => {
    // TODO
  }

  handleBookmarkButtonClick = () => {
    const pageId = this.props.pageId;
    const bookmarked = this.props.pageIsBookmarked;
    this.props.dispatch(ProfileEffects.setRemoteBookmarkState(pageId, !bookmarked));
  }

  render() {
    return (
      <div className={`browser-location ${LOCATION_BAR_STYLE}`}>
        <Btn title="Info"
          className={LOCATION_BAR_BUTTONS_STYLE}
          image={this.getInfoButtonIcon()}
          imgWidth="16px"
          imgHeight="16px"
          onClick={this.handleInfoButtonClick} />
        <AutocompletedSearch ref={e => this.awesomebar = e}
          className={LOCATION_BAR_INPUT_STYLE}
          defaultValue={this.props.pageLocation}
          onChange={this.handleInputChange}
          onKeyDown={this.handleInputKeyDown}
          onAutocompletionSelect={this.handleAutocompletionSelect}
          autocompletionResults={this.props.locationAutocompletions}
          autocompletionListItemComponent={AutocompletionListItem} />
        <Btn title="Bookmark"
          className={LOCATION_BAR_BUTTONS_STYLE}
          image={this.getBookmarkIcon()}
          imgWidth="16px"
          imgHeight="16px"
          onClick={this.handleBookmarkButtonClick} />
      </div>
    );
  }
}

Location.displayName = 'Location';

Location.propTypes = {
  dispatch: PropTypes.func.isRequired,
  pageId: PropTypes.string.isRequired,
  pageLocation: PropTypes.string.isRequired,
  pageIsBookmarked: PropTypes.bool.isRequired,
  locationAutocompletions: SharedPropTypes.LocationAutocompletions,
  onNavigate: PropTypes.func.isRequired,
};

function mapStateToProps(state, ownProps) {
  const page = PagesSelectors.getPageById(state, ownProps.pageId);
  return {
    pageLocation: page ? page.location : '',
    pageIsBookmarked: page ? ProfileSelectors.isBookmarked(state, page.location) : false,
    locationAutocompletions: page ? UISelectors.getLocationAutocompletions(state, page.id) : null,
  };
}

export default connect(mapStateToProps)(Location);
