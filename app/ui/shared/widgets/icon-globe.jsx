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
import * as ComponentUtil from '../util/component-util';

import FittedImage from './fitted-image';

class GlobeIcon extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = ComponentUtil.shouldPlainJsPropsComponentUpdate.bind(this);
  }

  render() {
    return (
      <FittedImage {...this.props}
        className={`widget-globe-icon ${this.props.className || ''}`}
        src="assets/globe.svg"
        width="16px"
        height="16px"
        mode="contain" />
    );
  }
}

GlobeIcon.displayName = 'GlobeIcon';

GlobeIcon.propTypes = {
  className: PropTypes.string,
};

export default GlobeIcon;
