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

import React, { PropTypes } from 'react';

import Style from '../style';
import FittedImage from './fitted-image';

const THUMBNAIL_STYLE = Style.registerStyle({
  overflow: 'hidden',
  border: '1px solid var(--theme-content-border-color)',
  borderRadius: 'var(--theme-default-roundness)',
  boxShadow: 'var(--theme-default-shadow)',
});

/**
 * A component that joins a fitted image and some children together
 * under the same parent.
 */
const Thumbnail = props => {
  return (
    <div id={props.id}
      style={props.style}
      className={`${THUMBNAIL_STYLE} ${props.className || ''}`}>
      <FittedImage src={props.src}
        width={props.imgWidth}
        height={props.imgHeight}
        mode={props.imgMode}
        repeat={props.imgRepeat}
        position={props.imgPosition} />
      {props.children}
    </div>
  );
};

Thumbnail.displayName = 'Thumbnail';

Thumbnail.propTypes = {
  src: PropTypes.string.isRequired,
  imgWidth: PropTypes.string.isRequired,
  imgHeight: PropTypes.string.isRequired,
  imgMode: PropTypes.oneOf(['cover', 'contain']).isRequired,
  imgRepeat: PropTypes.string,
  imgPosition: PropTypes.string,
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

export default Thumbnail;
