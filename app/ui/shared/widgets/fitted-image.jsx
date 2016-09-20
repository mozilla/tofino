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
import omit from 'lodash/omit';
import * as ComponentUtil from '../util/component-util';

import Style from '../style';

const BKG_REPEAT_DEFAULT = 'no-repeat';
const BKG_POSIITON_DEFAULT = 'center';

const FITTED_IMAGE_STYLE = Style.registerStyle({
  flexShrink: 0,
});

/**
 * A component that fits an image inside an element such that the correct
 * aspect ratio is preserved. Available modes are
 * - 'cover'
 * - 'contain'
 * - '100% auto'
 */
class FittedImage extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = ComponentUtil.shouldPlainJsPropsComponentUpdate.bind(this);
  }

  render() {
    return (
      <div {...omit(this.props, Object.keys(OmittedContainerProps))}
        style={{
          width: this.props.width,
          height: this.props.height,
          backgroundImage: this.props.src ? `url(${this.props.src})` : 'none',
          backgroundRepeat: this.props.repeat || BKG_REPEAT_DEFAULT,
          backgroundPosition: this.props.position || BKG_POSIITON_DEFAULT,
          backgroundSize: this.props.mode,
          ...this.props.style,
        }}
        className={`widget-fitted-image ${FITTED_IMAGE_STYLE} ${this.props.className || ''}`}>
        {this.props.children}
      </div>
    );
  }
}

FittedImage.displayName = 'FittedImage';

const OmittedContainerProps = {
  src: PropTypes.string,
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
  mode: PropTypes.oneOf(['cover', 'contain', '100% auto']).isRequired,
  repeat: PropTypes.string,
  position: PropTypes.string,
};

FittedImage.propTypes = {
  ...OmittedContainerProps,
  className: PropTypes.string,
  style: PropTypes.object, // eslint-disable-line
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

export default FittedImage;
