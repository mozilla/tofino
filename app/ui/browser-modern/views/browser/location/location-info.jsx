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

import Style from '../../../../shared/style';
import Btn from '../../../../shared/widgets/btn';
import SecurityBadge from './security-badge';

const LOCATION_BAR_INFO_STYLE = Style.registerStyle({
  alignItems: 'center',
});

const LOCATION_BAR_SECURITY_BADGE_STYLE = Style.registerStyle({
  marginLeft: '2px',
});

class LocationInfo extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  handleInfoButtonClick = () => {
    // TODO
  }

  handleConnectionButtonClick= () => {
    // TODO
  }

  render() {
    return (
      <div className={`browser-location-info ${LOCATION_BAR_INFO_STYLE}`}>
        <Btn title="Info"
          image="identity-icon.svg#normal"
          imageHover="identity-icon.svg#hover"
          imgWidth="16px"
          imgHeight="16px"
          onClick={this.handleInfoButtonClick} />
        <SecurityBadge className={LOCATION_BAR_SECURITY_BADGE_STYLE}
          pageId={this.props.pageId}
          onClick={this.handleConnectionButtonClick} />
      </div>
    );
  }
}

LocationInfo.displayName = 'LocationInfo';

LocationInfo.propTypes = {
  pageId: PropTypes.string.isRequired,
};

export default LocationInfo;
