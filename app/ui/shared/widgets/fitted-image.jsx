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

const BKG_REPEAT_DEFAULT = 'no-repeat';
const BKG_POSIITON_DEFAULT = 'center';

const FITTED_IMAGE_STYLE = Style.registerStyle({
  flexShrink: 0,
});

/**
 * A component that fits an image inside an element such that the correct
 * aspect ratio is preserved. Available modes are 'cover' and 'contain'.
 */
const FittedImage = props => {
  return (
    <div id={props.id}
      style={{
        width: props.width,
        height: props.height,
        backgroundImage: `url(${props.src})`,
        backgroundRepeat: props.repeat || BKG_REPEAT_DEFAULT,
        backgroundPosition: props.position || BKG_POSIITON_DEFAULT,
        backgroundSize: props.mode,
        ...props.style,
      }}
      className={`${FITTED_IMAGE_STYLE} ${props.className || ''}`}>
      {props.children}
    </div>
  );
};

FittedImage.displayName = 'FittedImage';

FittedImage.propTypes = {
  src: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
  mode: PropTypes.oneOf(['cover', 'contain']).isRequired,
  repeat: PropTypes.string,
  position: PropTypes.string,
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

export default FittedImage;
