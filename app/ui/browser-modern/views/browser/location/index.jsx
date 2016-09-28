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
import VerticalSeparator from '../../../../shared/widgets/vertical-separator';
import LocationInfo from './location-info';
import LocationButtons from './location-buttons';
import AutocompletedSearch from '../../../../shared/widgets/autocompleted-search';
import AutocompletionListItem from './autocompletion-list-item';

import { NAVBAR_HEIGHT, TABBAR_HEIGHT } from '../../../constants/ui';
import * as SharedPropTypes from '../../../model/shared-prop-types';
import * as LocationUtil from '../../../../shared/util/location-util';
import * as UISelectors from '../../../selectors/ui';
import * as PagesSelectors from '../../../selectors/pages';
import * as ProfileEffects from '../../../actions/profile-effects';
import * as PageEffects from '../../../actions/page-effects';

const LOCATION_BAR_STYLE = Style.registerStyle({
  flex: 1,
  alignSelf: 'stretch',
  alignItems: 'stretch',
  margin: '8px 0px',
  padding: '0 5px',
  borderRadius: 'var(--theme-default-roundness)',
  boxShadow: 'var(--theme-locationbar-box-shadow)',
  backgroundColor: 'var(--theme-content-background)',
});

const LOCATION_BAR_INPUT_STYLE = Style.registerStyle({
  flex: 1,
  padding: '0 1px',
  fontSize: '110%',
});

const DROPDOWN_LIST_STYLE = Style.registerStyle({
  maxHeight: `calc(100vh - ${NAVBAR_HEIGHT}px - ${TABBAR_HEIGHT}px)`,
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

  render() {
    return (
      <div className={`browser-location ${LOCATION_BAR_STYLE}`}>
        <LocationInfo pageId={this.props.pageId} />
        <VerticalSeparator className={SEPARATOR_STYLE} />
        <AutocompletedSearch ref={e => this.awesomebar = e}
          className={LOCATION_BAR_INPUT_STYLE}
          onChange={this.handleInputChange}
          onKeyDown={this.handleInputKeyDown}
          onAutocompletionPick={this.handleAutocompletionPick}
          dataSrc={this.props.locationAutocompletions}
          childComponent={AutocompletionListItem}
          dropdownListClassName={DROPDOWN_LIST_STYLE} />
        <LocationButtons pageId={this.props.pageId} />
      </div>
    );
  }
}

Location.displayName = 'Location';

Location.propTypes = {
  dispatch: PropTypes.func.isRequired,
  pageId: PropTypes.string.isRequired,
  locationAutocompletions: SharedPropTypes.LocationAutocompletions,
};

function mapStateToProps(state, ownProps) {
  const page = PagesSelectors.getPageById(state, ownProps.pageId);
  return {
    locationAutocompletions: UISelectors.getLocationAutocompletions(state, page.id),
  };
}

export default connect(mapStateToProps)(Location);
