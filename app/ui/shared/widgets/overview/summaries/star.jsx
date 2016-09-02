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

import Btn from '../../../../shared/widgets/btn';

const STAR_IMAGES = {
  full: 'glyph-ratings-full.svg',
  half: 'glyph-ratings-half.svg',
  empty: 'glyph-ratings-empty.svg',
};

class Star extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {
    const image = STAR_IMAGES[this.props.type];
    return (
      <Btn title={this.props.title}
        image={image}
        imgWidth="16px"
        imgHeight="16px"
        disabled={false}
        onClick={() => {}} />
    );
  }
}

Star.displayName = 'Star';

Star.propTypes = {
  title: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default Star;
