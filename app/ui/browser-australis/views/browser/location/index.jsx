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

import * as LocationUtil from '../../../../shared/util/location-util';

const LOCATION_BAR_STYLE = Style.registerStyle({
  flex: 1,
});

const INPUT_STYLE = Style.registerStyle({
  flex: 1,
});

class Location extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  componentDidUpdate() {
    this.input.value = this.props.textContent;
  }

  handleInputKeypress = e => {
    if (e.key === 'Enter') {
      this.props.onNavigate(LocationUtil.fixURL(e.target.value));
    }
  }

  render() {
    return (
      <div className={`browser-location ${LOCATION_BAR_STYLE}`}>
        <input ref={element => this.input = element}
          type="text"
          className={INPUT_STYLE}
          defaultValue={this.props.textContent}
          onKeyPress={this.handleInputKeypress} />
      </div>
    );
  }
}

Location.displayName = 'Location';

Location.propTypes = {
  textContent: PropTypes.string.isRequired,
  onNavigate: PropTypes.func.isRequired,
};

export default Location;
