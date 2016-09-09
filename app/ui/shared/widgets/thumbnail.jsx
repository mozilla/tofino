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

import omit from 'lodash/omit';
import Style from '../style';
import FittedImage from './fitted-image';

const THUMBNAIL_STYLE = Style.registerStyle({
  overflow: 'hidden',
  border: '1px solid var(--theme-content-border-color)',
  borderRadius: 'var(--theme-default-roundness)',
  boxShadow: 'var(--theme-default-shadow)',
});

const IMAGE_STYLE = Style.registerStyle({
  zIndex: -1,
});

/**
 * A component that joins a fitted image and some children together
 * under the same parent.
 */
class Thumbnail extends Component {
  shouldComponentUpdate(nextProps) {
    return !isEqual(this.props, nextProps);
  }

  render() {
    return (
      <div {...omit(this.props, Object.keys(OmittedContainerProps))}
        className={`widget-thumbnail ${THUMBNAIL_STYLE} ${this.props.className || ''}`}>
        <FittedImage className={IMAGE_STYLE}
          src={this.props.src}
          width={this.props.imgWidth}
          height={this.props.imgHeight}
          mode={this.props.imgMode}
          repeat={this.props.imgRepeat}
          position={this.props.imgPosition} />
        {this.props.children}
      </div>
    );
  }
}

Thumbnail.displayName = 'Thumbnail';

const OmittedContainerProps = {
  src: PropTypes.string,
  imgWidth: PropTypes.string.isRequired,
  imgHeight: PropTypes.string.isRequired,
  imgMode: PropTypes.string.isRequired,
  imgRepeat: PropTypes.string,
  imgPosition: PropTypes.string,
};

Thumbnail.propTypes = {
  ...OmittedContainerProps,
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  hidden: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

export default Thumbnail;
