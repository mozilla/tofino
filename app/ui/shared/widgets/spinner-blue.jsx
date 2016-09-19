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
import isEqual from 'lodash/isEqual';

import Style from '../style';
import FittedImage from './fitted-image';

const SPIN_KEYFRAMES = Style.registerKeyframes({
  from: {
    transform: 'rotate(0deg)',
  },
  to: {
    transform: 'rotate(360deg)',
  },
});

const SPINNER_STYLE = Style.registerStyle({
  animation: `${SPIN_KEYFRAMES} 1s linear infinite`,
});

class SpinnerBlue extends Component {
  shouldComponentUpdate(nextProps) {
    return !isEqual(this.props, nextProps);
  }

  render() {
    return (
      <FittedImage {...this.props}
        className={`widget-spinner ${SPINNER_STYLE} ${this.props.className || ''}`}
        src="assets/loading.png"
        width="16px"
        height="16px"
        mode="contain" />
    );
  }
}

SpinnerBlue.displayName = 'SpinnerBlue';

SpinnerBlue.propTypes = {
  className: PropTypes.string,
};

export default SpinnerBlue;
