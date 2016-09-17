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
import shallowEqual from 'fbjs/lib/shallowEqual';
import isEqual from 'lodash/isEqual';
import omit from 'lodash/omit';

import Style from '../style';

export const ENABLED_OPACITY = 1;
export const DISABLED_OPACITY = 0.5;
export const BKG_REPEAT_DEFAULT = 'no-repeat';
export const BKG_POSIITON_DEFAULT = 'center';
export const BKG_SIZE_DEFAULT = 'contain';

const BUTTON_STYLE = Style.registerStyle({
  WebkitUserSelect: 'none',
  WebkitAppRegion: 'no-drag',
  display: 'flex',
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
  boxSizing: 'content-box',
  backgroundClip: 'content-box',
  backgroundOrigin: 'content-box',
  margin: 0,
  padding: 0,
  border: 'none',
  background: 'none',
  color: 'inherit',
  font: 'inherit',
  textRendering: 'inherit',
  textShadow: 'inherit',
});

class Btn extends Component {
  static createCssRules(props) {
    const { disabled, width, height } = props;
    const { image, imgWidth, imgHeight, imgRepeat, imgPosition } = props;
    const { imageHover, imageActive, imgPositionHover, imgPositionActive } = props;

    const rules = {
      opacity: disabled ? DISABLED_OPACITY : ENABLED_OPACITY,
      width: width || imgWidth,
      height: height || imgHeight,
    };

    // Check for null or undefined here, so that we can use a default background
    // when an asset is intended, but not supplied yet. Simply checking for a
    // falsy value would render BKG_IMAGE_DEFAULT useless.
    if (image != null) {
      rules.backgroundImage = image ? `url(assets/${image})` : `url(${BKG_IMAGE_DEFAULT})`;
      rules.backgroundSize = imgWidth && imgHeight ? `${imgWidth} ${imgHeight}` : BKG_SIZE_DEFAULT;
      rules.backgroundRepeat = imgRepeat || BKG_REPEAT_DEFAULT;
      rules.backgroundPosition = imgPosition || BKG_POSIITON_DEFAULT;
      rules['&:hover'] = {
        backgroundImage: imageHover ? `url(assets/${imageHover})` : 'auto',
        backgroundPosition: imgPositionHover || imgPosition || BKG_POSIITON_DEFAULT,
      };
      rules['&:active'] = {
        backgroundImage: imageActive ? `url(assets/${imageActive})` : 'auto',
        backgroundPosition: imgPositionActive || imgPosition || BKG_POSIITON_DEFAULT,
      };
    }

    return rules;
  }

  componentWillMount() {
    this.style = Style.registerStyle(Btn.createCssRules(this.props));
  }

  shouldComponentUpdate(nextProps) {
    // Since this component uses plain js objects as props, we need to perform
    // deep quality checks on them to make sure we don't unnecessarily rerender.
    // However, there is no need to re-render this parent component when the
    // children change, which would happen when doing naive deep equality.
    // Furthermore, children in this component may contain immutable.js props,
    // which are throwing warnings when accessing some of their properties
    // while doing deep equality checks using lodash's `deepEqual`.
    return !shallowEqual(this.props.children, nextProps.children) ||
      !isEqual(omit(this.props, ['children']), omit(nextProps, ['children']));
  }

  componentWillUpdate(nextProps) {
    Style.remove(this.style);
    this.style = Style.registerStyle(Btn.createCssRules(nextProps));
  }

  render() {
    return (
      <button {...omit(this.props, Object.keys(OmittedContainerProps))}
        ref={e => this.node = e}
        className={`widget-btn ${BUTTON_STYLE} ${this.style} ${this.props.className || ''}`}
        onClick={this.props.disabled ? null : this.props.onClick}>
        {this.props.children}
      </button>
    );
  }
}

Btn.displayName = 'Btn';

const OmittedContainerProps = {
  image: PropTypes.string,
  imageHover: PropTypes.string,
  imageActive: PropTypes.string,
  imgWidth: PropTypes.string,
  imgHeight: PropTypes.string,
  imgRepeat: PropTypes.string,
  imgPosition: PropTypes.string,
  imgPositionHover: PropTypes.string,
  imgPositionActive: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

Btn.propTypes = {
  ...OmittedContainerProps,
  title: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object, // eslint-disable-line
  children: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.node),
    React.PropTypes.node,
  ]),
};

export default Btn;

/* eslint-disable max-len */

// Use a data URI to a Mozilla "M" for now if we don't have an asset for a button.
export const BKG_IMAGE_DEFAULT =
  'data:image/png;base64,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';
